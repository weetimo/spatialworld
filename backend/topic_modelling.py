import random
import pandas as pd
from dotenv import load_dotenv  
from openai import OpenAI
from typing import List
import os

load_dotenv()
client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY"),  # This is the default and can be omitted
)

def GenerateTopics(prompts: List[str]):
    combined_text = "\n\n".join(prompts)  
    print('Joined all prompts!')

    prompt = (
        f"Analyze the following prompts and extract exactly 7 high-level topics "
        f"that summarize their main themes.\n\n{combined_text}\n\n"
        f"Provide a numbered list with exactly 7 distinct topics. Topics:"
    )

    completion = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.5,
        max_tokens=500
    )

    print('Finished!')
    return completion.choices[0].message.content
