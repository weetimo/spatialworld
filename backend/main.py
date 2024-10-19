from fastapi import FastAPI, HTTPException, Request

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


# run server with uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4 (where workers creates 4 parallel worker processes. Each worker can handle multiple requests)