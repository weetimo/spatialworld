from fastapi import FastAPI, HTTPException, Request, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from image_segmentation import ImageSegmentationService, PointCoordinates, SegmentationResponse
from topic_modelling import GenerateTopics
from openai import OpenAI
from typing import List, Optional
import os
from PIL import Image, ImageOps
import io
import logging
import base64
import requests
from dotenv import load_dotenv
from bertopic import BERTopic
import openai
from bertopic.representation import OpenAI as BertOpenAI
import json

load_dotenv()

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=False,  
    allow_methods=["*"], 
    allow_headers=["*"], 
)

client = OpenAI(api_key="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")

topic_model = BERTopic()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def validate_and_prepare_image(image: UploadFile, target_size: tuple = None) -> io.BytesIO:
    try:
        logger.info(f"Validating image: {image.filename}")
        contents = await image.read()
        image.file.seek(0)
        img = Image.open(io.BytesIO(contents))
        if img.format != 'PNG':
            buffer = io.BytesIO()
            img.save(buffer, format="PNG")
            contents = buffer.getvalue()

        if target_size and (img.width != target_size[0] or img.height != target_size[1]):
            img = img.resize(target_size, resample=Image.Resampling.LANCZOS)
            buffer = io.BytesIO()
            img.save(buffer, format="PNG")
            contents = buffer.getvalue()

        if len(contents) > 4 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="Image size must be less than 4 MB after resizing.")

        return io.BytesIO(contents)

    except Exception as e:
        logger.error(f"Error validating image: {str(e)}")
        raise HTTPException(status_code=500, detail="Invalid image format or processing error.")


def CaptionUpscale(prompt: str):
    llm_prompt = """
    You are an expert in crafting detailed prompts for DALL-E's inpainting feature.
    IMPORTANT: Your prompts must describe the ENTIRE desired final image, not just the area being edited.

    Transform the user's input into a comprehensive prompt by following these guidelines:

    1. FULL SCENE DESCRIPTION:
    - Describe the complete scene as you want it to appear in the final image
    - Include both the areas being kept AND the areas being edited
    - Maintain context and continuity with the unmasked portions of the image

    2. KEY ELEMENTS TO SPECIFY:
    - Main subjects and their placement
    - Complete environment and setting
    - Background elements and their relationship to the main subject
    - Overall composition and layout
    - Lighting conditions affecting the entire scene
    - Color palette and mood for the whole image
    - Perspective and viewing angle

    Remember: 
    - The prompt should describe how the ENTIRE final image should look, not just the masked area
    - Ensure visual coherence between edited and unedited areas
    - Keep descriptions clear and precise, maximum 30 words
    - Focus on natural integration between existing and new elements

    Example:
    Instead of: "Add a cat in the empty space"
    Write: "A cozy living room with a ginger cat lounging on the green sofa, warm sunlight streaming through bay windows, vintage photographs on cream walls"
    """
    print('Received caption!')
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": llm_prompt},
            {"role": "user", "content": prompt}
        ]
    )
    print('Finished!')
    return completion.choices[0].message.content

@app.post("/improve-caption/")
async def improve_caption(request: Request):
    try:
        logger.info("Received caption improvement request")
        body = await request.json()
        user_prompt = body.get("prompt", "")
        
        logger.info("Processing caption improvement...")
        improved_prompt = CaptionUpscale(user_prompt)
        logger.info("Caption improvement completed")
        
        return {"improved_prompt": improved_prompt}
    except Exception as e:
        logger.error(f"Error improving caption: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# inpainting image
@app.post("/api/edit-image")
async def edit_image(
    image: UploadFile = File(...),
    mask: Optional[UploadFile] = File(None),
    prompt: str = Form(...),
    size: str = Form("1024x1024")
):
    try:
        width, height = map(int, size.split('x'))
        image_contents = await image.read()
        base64_image = base64.b64encode(image_contents).decode('utf-8')
        mask_contents = await mask.read() if mask else None
        base64_mask = base64.b64encode(mask_contents).decode('utf-8') if mask_contents else None
        response = requests.post(
            "https://api.getimg.ai/v1/stable-diffusion-xl/inpaint",
            headers={
                "accept": "application/json",
                "content-type": "application/json",
                "authorization": f"Bearer {os.getenv('GETIMG_API_KEY')}"
            },
            json={
                "prompt": prompt,
                "image": base64_image,
                "mask_image": base64_mask,
                "width": width,
                "height": height,
                "strength": 0.5,
                "response_format": "url",  
                "output_format": "jpeg"  
            }
        )
        
        logger.info(f"GETIMG API response status: {response.status_code}")
        logger.info(f"GETIMG API response headers: {dict(response.headers)}")
        
        if response.status_code != 200:
            logger.error(f"GETIMG API error: {response.text}")
            raise HTTPException(
                status_code=response.status_code,
                detail="Image generation failed"
            )
            
        result = response.json()
        return JSONResponse({
            "success": True,
            "url": result["url"]
        })

    except Exception as e:
        logger.error(f"Error processing image: {str(e)}")
        raise HTTPException(status_code=500, detail="Image processing failed.")

# image to image
@app.post("/api/img2img")
async def img2img(
    image: UploadFile = File(...),
    prompt: str = Form(...)
):
    try:
        logger.info(f"Received img2img request with prompt: {prompt}")
        contents = await image.read()
        img = Image.open(io.BytesIO(contents))
        if img.format != 'PNG':
            buffer = io.BytesIO()
            img.save(buffer, format="PNG")
            contents = buffer.getvalue()
        
        base64_image = base64.b64encode(contents).decode('utf-8')
        logger.info(f"Image size: {len(base64_image)}")
        logger.info(f"Image dimensions: {img.size}")
        
        api_key = os.getenv('GETIMG_API_KEY')
        if not api_key:
            logger.error("GETIMG_API_KEY not found")
            return JSONResponse(
                status_code=500,
                content={"error": "GETIMG API key not configured"}
            )
        
        payload = {
            "prompt": prompt,
            "image": base64_image,
            "strength": 0.5,
            "response_format": "url"
        }
        logger.info("Making request to GETIMG API")
        logger.info(f"Headers: {{'Authorization': 'Bearer ***', 'Content-Type': 'application/json'}}")
        logger.info(f"Payload keys: {list(payload.keys())}")
        
        response = requests.post(
            "https://api.getimg.ai/v1/stable-diffusion-xl/image-to-image",
            headers={
                "accept": "application/json",
                "content-type": "application/json",
                "authorization": f"Bearer {api_key}"
            },
            json=payload
        )
        logger.info(f"Response status: {response.status_code}")
        logger.info(f"Response headers: {dict(response.headers)}")
        
        try:
            result = response.json()
            logger.info(f"Response content: {result}")
            if "error" in result:
                return JSONResponse(
                    status_code=500,
                    content={"error": f"GETIMG API error: {result['error']}"}
                )
            
            if "url" not in result:
                return JSONResponse(
                    status_code=500,
                    content={
                        "error": "No URL in response",
                        "received_keys": list(result.keys()),
                        "response": result
                    }
                )
            
            return JSONResponse(
                status_code=200,
                content={"success": True, "url": result["url"]}
            )
            
        except ValueError as e:
            logger.error(f"Failed to parse response as JSON: {response.text}")
            return JSONResponse(
                status_code=500,
                content={"error": f"Invalid JSON response: {response.text[:500]}"}
            )
            
    except Exception as e:
        logger.error(f"Error in img2img endpoint: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": f"Server error: {str(e)}"}
        )

# analyze image to give them a tag
@app.post("/api/analyze-image")
async def analyze_image(request: Request):
    try:
        body = await request.json()
        image_url = body.get("image_url")
        if not image_url:
            raise HTTPException(status_code=400, detail="Image URL is required")
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Analyze this image in the context of urban redevelopment. What category would this fall under? Choose from: Public Space Enhancement, Infrastructure Modernization, Sustainable Development, Cultural Preservation, or Mixed-Use Development. Provide just the category name."
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": image_url,
                                "detail": "low" 
                            }
                        }
                    ]
                }
            ],
            max_tokens=100
        )
        logger.info(f"Vision API Response: {response}")
        category = response.choices[0].message.content.strip()
        return JSONResponse({"category": category})
        
    except Exception as e:
        logger.error(f"Error analyzing image: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": f"Analysis failed: {str(e)}"}
        )

# berttopic with representation model
def initialize_topic_model():
    try:
        representation_model = BertOpenAI(
            # client=client,  
            model="gpt-4o-mini",
            chat=True
        )
        topic_model = BERTopic(
            representation_model=representation_model,
            min_topic_size=3,
            n_gram_range=(1, 2),
            calculate_probabilities=True,
            verbose=True
        )
        
        return topic_model
    except Exception as e:
        logger.error(f"Failed to initialize topic model: {str(e)}")
        raise

# generate topics
@app.post("/api/generate-topics")
async def generate_topics(request: Request):
    try:
        body = await request.json()
        prompts = body.get("generations") #{"generations": ["sentence"]}
        
        if not isinstance(prompts, list) or not all(isinstance(p, str) for p in prompts):
            raise HTTPException(
                status_code=400, 
                detail="Invalid input. 'prompts' should be a list of strings."
            )

        topic_model = initialize_topic_model()
        logger.info("Generating topics using BERTopic with GPT fine-tuning...")
        topics, _ = topic_model.fit_transform(prompts)
        topic_info = topic_model.get_topic_info()
        top_topics = []
        for _, row in topic_info.iterrows():
            try:
                if row['Topic'] != -1:  
                    topic_words = topic_model.get_topic(row['Topic'])
                    if topic_words:  
                        topic_name = " ".join([word for word, _ in topic_words[:3]])
                        top_topics.append(topic_name)
            except Exception as e:
                logger.warning(f"Skipping problematic topic: {e}")
                continue

        if not top_topics:
            raise Exception("No valid topics were generated")

        logger.info(f"Generated {len(top_topics)} topics successfully")
        return JSONResponse({
            "topics": top_topics[:20] 
        })

    except Exception as e:
        logger.error(f"Error generating topics: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={
                "error": f"Topic generation failed: {str(e)}"
            }
        )
        
# initialize basic topic model        
def initialize_basic_topic_model():
    try:
        topic_model = BERTopic(
            min_topic_size=3,
            n_gram_range=(1, 2),
            calculate_probabilities=True,
            verbose=True
        )
        return topic_model
    except Exception as e:
        logger.error(f"Failed to initialize basic topic model: {str(e)}")
        raise

# generate words
@app.post("/api/generate-words")
async def generate_words(request: Request):
    try:
        body = await request.json()
        prompts = body.get("prompts")
        
        if not isinstance(prompts, list) or not all(isinstance(p, str) for p in prompts):
            raise HTTPException(
                status_code=400, 
                detail="Invalid input. 'prompts' should be a list of strings."
            )

        topic_model = initialize_basic_topic_model()
        logger.info("Extracting words using BERTopic...")

        topics, _ = topic_model.fit_transform(prompts)
        word_frequencies = {}
        for topic_id in topic_model.get_topics():
            words_with_weights = topic_model.get_topic(topic_id)
            for word, weight in words_with_weights:
                if word in word_frequencies:
                    word_frequencies[word] += weight
                else:
                    word_frequencies[word] = weight
        sorted_words = sorted(word_frequencies.keys(), 
                            key=lambda x: word_frequencies[x], 
                            reverse=True)

        logger.info(f"Generated {len(sorted_words)} unique words")
        return JSONResponse({
            "words": sorted_words
        })

    except Exception as e:
        logger.error(f"Error generating words: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={
                "error": f"Word generation failed: {str(e)}"
            }
        )

# community image  
@app.post("/api/community-image")
async def generate_community_image(request: Request):
    try:
        body = await request.json()
        prompts = body.get("prompts", [])
        base64_image = body.get("image", "")
        image_path = body.get("image_path", "")
        
        print(f"Processing {len(prompts)} prompts")

        words_response = await generate_words(request)
        words_content = json.loads(words_response.body)
        words = words_content.get("words", [])
        
        print(f"Generated words: {words[:10]}")
        topics_text = ", ".join(words[:10])
        print(f"Topics text: {topics_text}")
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "Generate a concise Stable Diffusion prompt. Do not include any formatting, labels, or asterisks. Just output the prompt text directly."
                },
                {
                    "role": "user",
                    "content": f"Create a Stable Diffusion prompt that combines these key elements: {topics_text}. Focus on the most important shared themes for urban development visualization. Be concise and direct."
                }
            ],
            max_tokens=100
        )
        
        generated_prompt = response.choices[0].message.content.strip()
        print(f"Generated prompt: {generated_prompt}")

        if image_path:
            with open(image_path, "rb") as img_file:
                contents = img_file.read()
        elif base64_image:
            if "base64," in base64_image:
                base64_image = base64_image.split("base64,")[1]
            contents = base64.b64decode(base64_image)

        img = Image.open(io.BytesIO(contents))
        print(f"Original image size: {img.size}")
        
        # max 1024x1024 and maintaining aspect ratio
        max_size = 1024
        ratio = min(max_size/img.width, max_size/img.height)
        new_size = (int(img.width * ratio), int(img.height * ratio))
        img = img.resize(new_size, Image.Resampling.LANCZOS)
        print(f"Resized image to: {img.size}")

        buffer = io.BytesIO()
        img.save(buffer, format="PNG")
        contents = buffer.getvalue()

        image_io = io.BytesIO(contents)
        upload_file = UploadFile(filename="image.png", file=image_io)
        
        img2img_response = await img2img(image=upload_file, prompt=generated_prompt)
        result = json.loads(img2img_response.body)
        
        return JSONResponse({
            "success": True,
            "url": result["url"],
            "generated_prompt": generated_prompt,
            "key_topics": words[:10]
        })
        
    except Exception as e:
        print(f"Error in community image: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Community image generation failed: {str(e)}")
    
    
# impact
CHARACTERS = {
    "Mrs.Eleanor Tan": {
        "age": 72,
        "description": "Retired school teacher who enjoys gardening and community activities",
        "needs": ["Accessibility", "Healthcare Access", "Social Spaces", "Safety"]
    },
    "Kumar and Priya": {
        "age": "35, 33",
        "description": "Parents with young children in tech and education",
        "needs": ["Play Areas", "Educational Facilities", "Family Amenities", "Safety"]
    },
    "Alex Wong": {
        "age": 28,
        "description": "Graphic designer using a wheelchair",
        "needs": ["Accessibility", "Infrastructure", "Inclusive Design"]
    },
    "Maya Chen": {
        "age": 30,
        "description": "Environmental scientist focused on sustainability",
        "needs": ["Green Spaces", "Public Transport", "Sustainability"]
    },
    "Ethan Lim": {
        "age": 22,
        "description": "Computer science student",
        "needs": ["Study Areas", "Affordability", "Internet Access"]
    }
}

# create a structured prompt
def create_structured_prompt() -> str:
    return """Analyze this urban space for each character. Provide ONLY a JSON response with the following strict format:
    {
    "character_name": "brief impact analysis focusing on their specific needs",
    ...
    }
    Keep each analysis concise (1-3 sentences) and focused on their primary needs. Characters to analyze:

    """ + "\n".join([
    f"- {name}: {details['description']} (Age: {details['age']}) - Needs: {', '.join(details['needs'])}"
    for name, details in CHARACTERS.items()
])

@app.post("/api/character-impact")
async def character_impact(request: Request):
    try:
        body = await request.json()
        image_url = body.get("image_url")
        
        print("Received API Request")
        if not image_url:
            raise HTTPException(status_code=400, detail="Image URL is required")
            
        print("Making OpenAI Request")
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": create_structured_prompt()
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Analyze this urban space and provide a single JSON response with character-specific impacts."
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": image_url,
                                "detail": "low"
                            }
                        }
                    ]
                }
            ],
            max_tokens=1000,
            response_format={ "type": "json_object" }  # force a JSON response
        )

        analysis = json.loads(response.choices[0].message.content)
        print("Analysis received:", analysis)
        
        return JSONResponse({
            "success": True,
            "analysis": analysis
        })
        
    except Exception as e:
        print(f"Error Occurred: {str(e)}")
        logger.error(f"Error in character impact analysis: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}"
        )
        
# categorize free response
@app.post("/api/categorize-responses")
async def categorize_responses(request: Request):
    try:
        body = await request.json()
        responses = body.get("responses", [])
        
        print(f"Processing {len(responses)} responses")
        
        if not isinstance(responses, list) or not all(isinstance(r, str) for r in responses):
            raise HTTPException(
                status_code=400,
                detail="Invalid input. 'responses' should be a list of strings."
            )

        topic_model = initialize_topic_model()
        topics, _ = topic_model.fit_transform(responses)
        
        topic_categories = {}
        grouped_responses = {} 
        
        for topic_id in set(topics):
            if topic_id == -1: continue  # Skip invalid topics
            keywords = topic_model.get_topic(topic_id)[:5]
            keyword_list = ', '.join([word for word, _ in keywords])
            
            # Generate category name using the model
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "system",
                        "content": "Based on these key words, provide a concise 1-2 word category name. The category name should be broad enough to encompass similar responses."
                    },
                    {
                        "role": "user",
                        "content": f"Keywords: {keyword_list}"
                    }
                ],
                max_tokens=10
            )
            
            category_name = response.choices[0].message.content.strip()
            topic_categories[topic_id] = category_name
            grouped_responses[category_name] = []

        # Assign responses to their respective categories
        for r, t in zip(responses, topics):
            if t != -1:
                category_name = topic_categories[t]
                grouped_responses[category_name].append(r)
            else:
                grouped_responses.setdefault("Other", []).append(r)
        
        # Format the output
        output = [
            {"topic": topic, "responses": grouped_responses[topic]}
            for topic in grouped_responses
        ]
        
        print("Grouped responses:", output)
        
        return JSONResponse({
            "success": True,
            "categories": output
        })
        
    except Exception as e:
        print(f"Error in categorization: {str(e)}")
        logger.error(f"Error categorizing responses: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Categorization failed: {str(e)}"
        )
# uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4 --reload