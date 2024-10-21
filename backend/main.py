from fastapi import FastAPI, HTTPException, Request
from image_segmentation import ImageSegmentationService, PointCoordinates, SegmentationResponse
import os

# initialize
app = FastAPI()

# example function
def process_text(text: str) -> str:
    if "hello" in text.lower():
        return "Hi there! 👋"
    else:
        return "I don't recognize that."

# accept json without pydantic?  am checking whether this works
@app.post("/analyze/")
async def analyze_text(request: Request):
    try:
        body = await request.json()  # Parse the JSON body
        text = body.get("text", "")
        response = process_text(text)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

image_segmentation_service = ImageSegmentationService()

@app.post("/segment/", response_model=SegmentationResponse)
async def segment_image(coordinates: PointCoordinates):
    try:
        image_path = os.path.join(image_segmentation_service.working_dir, "input/example.webp")
        if not os.path.exists(image_path):
            raise HTTPException(status_code=404, detail="Input image not found")

        encoded_mask = await image_segmentation_service.process_image(
            image_path,
            coordinates.point
        )

        return SegmentationResponse(
            success=True,
            encoded_masks=encoded_mask
        )

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

# run server with uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4 (where workers creates 4 parallel worker processes. Each worker can handle multiple requests)
