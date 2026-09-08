import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load your API key from the .env file
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

print("Fetching available models...")

# Loop through and print every model your key can use for text generation
for m in genai.list_models():
    if 'generateContent' in m.supported_generation_methods:
        print(m.name)