from fastapi import FastAPI, HTTPException, Request, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response
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
from datetime import datetime
import uuid
import pathlib

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://weetimo.github.io"],
    allow_credentials=True,
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


def generate_prompt(prompt: str, mode: str) -> str:
    """
    Generates a refined and task-specific prompt based on the given mode (img2img or inpainting).
    :param prompt: User-provided input.
    :param mode: Operation mode ('img2img' or 'inpainting').
    :return: A crafted prompt tailored for the given mode.
    """
    if mode == "inpainting":
        llm_prompt = """
        You are an expert in creating prompts for inpainting tasks using DALL-E or similar tools.
        
        Goal:
        - Focus only on what needs to be added or changed in the masked area.
        - Capture the users wants, and make it clear, emphasize on the mood and the them as well.
        """
    elif mode == "img2img":
        llm_prompt = """
        You are an expert in creating prompts for img2img transformations using DALL-E or similar tools.
        
        Goal:
        - Focus on extracting the overall transformation idea from the user input.
        - Keep it descriptive but concise, emphasizing the high-level style, mood, or theme of the image.
        """
    else:
        raise ValueError("Invalid mode. Supported modes: 'img2img', 'inpainting'.")

    print(f"Generating a refined {mode} prompt...")
    completion = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": llm_prompt},
            {"role": "user", "content": prompt}
        ]
    )
    print("Prompt generation completed.")
    return completion.choices[0].message.content


# caption improvement
@app.post("/improve-caption/")
async def improve_caption(request: Request):
    try:
        logger.info("Received caption improvement request")
        body = await request.json()
        user_prompt = body.get("prompt", "")
        mode = body.get("mode", "").lower()
        if not user_prompt:
            raise HTTPException(status_code=400, detail="Prompt is required.")
        if mode not in ["img2img", "inpainting"]:
            raise HTTPException(status_code=400, detail="Invalid mode. Use 'img2img' or 'inpainting'.")

        logger.info(f"Processing {mode} caption improvement...")
        improved_prompt = generate_prompt(user_prompt, mode)
        logger.info("Caption improvement completed successfully.")

        return {"improved_prompt": improved_prompt}
    except Exception as e:
        logger.error(f"Error improving caption: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


# inpainting image
@app.post("/api/edit-image")
async def edit_image(
    image: UploadFile = File(...),
    mask: Optional[UploadFile] = File(None),
    prompt: str = Form(...),
    size: str = Form("512x512")  
):
    try:
        width, height = 512, 512
        image_contents = await image.read()
        original_img = Image.open(io.BytesIO(image_contents))
        logger.info(f"Original Image Size: {original_img.size}")
        resized_img = original_img.resize((width, height), Image.Resampling.LANCZOS)
        buffer = io.BytesIO()
        resized_img.save(buffer, format="PNG")
        resized_contents = buffer.getvalue()
        base64_image = base64.b64encode(resized_contents).decode('utf-8')
        base64_mask = None
        if mask:
            mask_contents = await mask.read()
            mask_img = Image.open(io.BytesIO(mask_contents))
            logger.info(f"Original Mask Size: {mask_img.size}")
            resized_mask = mask_img.resize((width, height), Image.Resampling.LANCZOS)
            mask_buffer = io.BytesIO()
            resized_mask.save(mask_buffer, format="PNG")
            resized_mask_contents = mask_buffer.getvalue()
            base64_mask = base64.b64encode(resized_mask_contents).decode('utf-8')
            logger.info(f"Resized Mask Size: {resized_mask.size}")

        response = requests.post(
            "https://api.getimg.ai/v1/stable-diffusion/inpaint",
            headers={
                "accept": "application/json",
                "content-type": "application/json",
                "authorization": f"Bearer {os.getenv('GETIMG_API_KEY')}"
            },
            json={
                "model": "realistic-vision-v5-1-inpainting",
                "prompt": prompt,
                "image": base64_image,#
                "mask_image": base64_mask,
                "width": width,
                "height": height,
                "strength": 0.8,
                "steps": 80,
                "guidance": 10,
                "response_format": "url",
                "output_format": "jpeg"
            }
        )

        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Image generation failed")
            
        result = response.json()
        return JSONResponse({"success": True, "url": result["url"]})

    except Exception as e:
        logger.error(f"Error processing image: {str(e)}")
        raise HTTPException(status_code=500, detail="Image processing failed.")

# image to image
@app.post("/api/img2img")
async def img2img(
    image: UploadFile = File(...),
    prompt: str = Form(...),
    size: str = Form("512x512")
):
    try:
        logger.info("Starting img2img processing...")
        logger.info(f"Received image: {image.filename}, content_type: {image.content_type}")
        logger.info(f"Prompt: {prompt}")
        contents = await image.read()
        img = Image.open(io.BytesIO(contents))
        logger.info(f"Original image size: {img.size}, mode: {img.mode}")
        width, height = 512, 512
        img = ImageOps.fit(img, (width, height), method=Image.Resampling.LANCZOS)
        if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
            img = img.convert('RGB')
        buffer = io.BytesIO()
        img.save(buffer, format="JPEG", quality=95)
        buffer.seek(0)
        base64_image = base64.b64encode(buffer.getvalue()).decode('utf-8')
        api_key = os.getenv('GETIMG_API_KEY')
        if not api_key:
            raise HTTPException(status_code=500, detail="API key not configured")
        payload = {
            "model": "realvis-xl-v4",
            "prompt": prompt,
            "image": base64_image,
            "width": width,
            "height": height,
            "strength": 0.7,
            "response_format": "url"
        }

        logger.info("Sending request to GetImg.ai API...")
        response = requests.post(
            "https://api.getimg.ai/v1/stable-diffusion-xl/image-to-image",
            headers={
                "accept": "application/json",
                "content-type": "application/json",
                "authorization": f"Bearer {api_key}"
            },
            json=payload,
            timeout=30
        )
        
        logger.info(f"API response status code: {response.status_code}")
        response_json = response.json()

        if response.status_code != 200:
            error_detail = response_json.get('error', {}).get('message', 'Unknown error')
            logger.error(f"API request failed: {response.status_code} {error_detail}")
            raise HTTPException(
                status_code=response.status_code,
                detail=f"Image generation failed: {error_detail}"
            )

        if "url" not in response_json:
            raise HTTPException(status_code=502, detail="Invalid response from image service")

        logger.info("Successfully generated image")
        return JSONResponse({"success": True, "url": response_json["url"]})

    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Unexpected error in img2img endpoint: {str(e)}")
        logger.exception("Full traceback:")
        raise HTTPException(status_code=500, detail=f"Image processing failed: {str(e)}")
    
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

def save_image_locally(image_data: bytes, session_id: str = None) -> str:
    """
    Save image data to a local directory outside the repo, organized by date and session.
    
    Args:
        image_data: The image data in bytes
        session_id: Optional session ID. If not provided, a new UUID will be generated
        
    Returns:
        str: The path where the image was saved
    """
    # Create base directory in user's home directory
    base_dir = pathlib.Path.home() / "spatial_journey_images"
    
    # Create date-based directory
    date_dir = base_dir / datetime.now().strftime("%Y-%m-%d")
    
    # Create session directory
    if not session_id:
        session_id = str(uuid.uuid4())
    session_dir = date_dir / session_id
    
    # Create all necessary directories
    session_dir.mkdir(parents=True, exist_ok=True)
    
    # Generate unique filename
    timestamp = datetime.now().strftime("%H-%M-%S")
    filename = f"image_{timestamp}.png"
    file_path = session_dir / filename
    
    # Save the image
    with open(file_path, "wb") as f:
        f.write(image_data)
    
    return str(file_path)

@app.get("/proxy-image")
async def proxy_image(url: str):
    try:
        response = requests.get(url)
        return Response(
            content=response.content,
            media_type=response.headers.get('content-type', 'image/jpeg'),
            headers={
                'Cache-Control': 'public, max-age=31536000',
                'Access-Control-Allow-Origin': '*'
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4 --reload