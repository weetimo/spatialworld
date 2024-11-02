import time
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
# client = OpenAI(api_key=OPENAI_API_KEY) 
client = OpenAI(api_key='sk-cAqEOuDHGqqrN0KGfFV1Z5kkHIMjYo-fR_C6sWdmOHT3BlbkFJwQ3T4FnvfIK0gAdOIVLt48gEyXajBzvd5TubTMoN4A')

llm_prompt = """
You are an expert in crafting detailed prompts for Midjourney's inpainting feature. 
Transform the user's brief input into a comprehensive prompt by:
1. Clearly defining the main subject.
2. Describing the setting, environment, and background elements.
3. Specifying desired art styles or artist influences.
4. Including technical details like lighting, mood, and camera angles.
5. Using vivid and precise language.
Ensure the prompt is concise yet descriptive and not more than 40 words.
"""


def CaptionUpscale(prompt: str):
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
