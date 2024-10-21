from fastapi import FastAPI, HTTPException, Request
from image_segmentation import ImageSegmentationService, PointCoordinates, SegmentationResponse
from topic_modelling import GenerateTopics
from caption_upscaling import CaptionUpscale
from openai import OpenAI
from typing import List
import os

# initialize
app = FastAPI()

# intialize image segmentation
image_segmentation_service = ImageSegmentationService()

@app.post("/segment/", response_model=SegmentationResponse)
async def segment_image(coordinates: PointCoordinates):
    try:
        image_path = os.path.join(image_segmentation_service.working_dir, "input/example.webp")
        if not os.path.exists(image_path):
            raise HTTPException(status_code=404, detail="Input image not found")
        encoded_mask = await image_segmentation_service.process_image(
            image_path,
            coordinates.point)
        return SegmentationResponse(
            success=True,
            encoded_masks=encoded_mask)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 
    

    
@app.post("/generate-topics/")
async def generate_topics(request: Request):
    try:
        body = await request.json()
        prompts = body.get("prompts", [])
        if not isinstance(prompts, list) or not all(isinstance(p, str) for p in prompts):
            raise HTTPException(status_code=400, detail="Invalid input. 'prompts' should be a list of strings.")

        topics = GenerateTopics(prompts)
        return {"topics": topics}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    

@app.post("/improve-caption/")
async def improve_caption(request: Request):
    try:
        body = await request.json()
        user_prompt = body.get("prompt", "")
        improved_prompt = CaptionUpscale(user_prompt)
        return {"improved_prompt": improved_prompt}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, workers=4, reload=True)

# run server with uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4 (where workers creates 4 parallel worker processes. Each worker can handle multiple requests)
