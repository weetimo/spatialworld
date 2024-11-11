from fastapi import FastAPI, HTTPException, Request, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from image_segmentation import ImageSegmentationService, PointCoordinates, SegmentationResponse
from topic_modelling import GenerateTopics
from caption_upscaling import CaptionUpscale
from openai import OpenAI
from typing import List, Optional
import os
from PIL import Image, ImageOps
import io
import logging

# initialize
app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# intialize image segmentation
# image_segmentation_service = ImageSegmentationService()

client = OpenAI(api_key='sk-cAqEOuDHGqqrN0KGfFV1Z5kkHIMjYo-fR_C6sWdmOHT3BlbkFJwQ3T4FnvfIK0gAdOIVLt48gEyXajBzvd5TubTMoN4A')

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

@app.post("/api/edit-image")
async def edit_image(
    image: UploadFile = File(...),
    mask: Optional[UploadFile] = File(None),
    prompt: str = Form(...),
    size: str = Form("1024x1024")
):
    try:
        prepared_image = await validate_and_prepare_image(image)
        if mask:
            original_image = Image.open(prepared_image)
            target_size = (original_image.width, original_image.height)
            prepared_mask = await validate_and_prepare_image(mask, target_size=target_size)
        else:
            prepared_mask = None

        response = client.images.edit(
            model="dall-e-2",  # Using DALL-E-2 model
            image=prepared_image,
            mask=prepared_mask,
            prompt=prompt,
            n=1,
            size=size
        )
        return JSONResponse({"success": True, "url": response.data[0].url})

    except Exception as e:
        logger.error(f"Error processing image: {str(e)}")
        raise HTTPException(status_code=500, detail="Image processing failed.")


# @app.post("/api/segment/", response_model=SegmentationResponse)
# async def segment_image(coordinates: PointCoordinates):
#     try:
#         logger.info(f"Received segmentation request for coordinates: {coordinates.point}")
        
#         image_path = os.path.join(image_segmentation_service.working_dir, "input/example.webp")
#         if not os.path.exists(image_path):
#             logger.error(f"Input image not found at path: {image_path}")
#             raise HTTPException(status_code=404, detail="Input image not found")
            
#         logger.info("Processing image segmentation...")
#         encoded_mask = await image_segmentation_service.process_image(
#             image_path,
#             coordinates.point)
#         logger.info("Segmentation completed successfully")
        
#         return SegmentationResponse(
#             success=True,
#             encoded_masks=encoded_mask)
#     except HTTPException as e:
#         raise e
#     except Exception as e:
#         logger.error(f"Error during segmentation: {str(e)}")
#         raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate-topics/")
async def generate_topics(request: Request):
    try:
        logger.info("Received topic generation request")
        body = await request.json()
        prompts = body.get("prompts", [])
        if not isinstance(prompts, list) or not all(isinstance(p, str) for p in prompts):
            raise HTTPException(status_code=400, detail="Invalid input. 'prompts' should be a list of strings.")

        logger.info(f"Generating topics for {len(prompts)} prompts...")
        topics = GenerateTopics(prompts)
        logger.info("Topic generation completed")
        return {"topics": topics}

    except Exception as e:
        logger.error(f"Error generating topics: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, workers=4, reload=True)
    
# run server with uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4 (where workers creates 4 parallel worker processes. Each worker can handle multiple requests)
