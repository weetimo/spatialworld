import time
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=OPENAI_API_KEY) 

llm_prompt = """
You are an expert at creating detailed, descriptive prompts for Midjourney image generation. 
Given a user's input, convert it into a highly detailed prompt that Midjourney can use to generate a vivid and accurate image. 
Follow these guidelines:
1. Begin with a clear, concise description of the main subject.
2. Add details about the setting, lighting, mood, and atmosphere.
3. Specify any particular style, artist influence, or art movement if relevant.
4. Include technical details like camera angle, depth of field, or specific photography/art techniques.
5. Use strong, descriptive adjectives and avoid vague terms.
6. Keep the prompt under 60 words for optimal results.
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
