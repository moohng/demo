import requests
from dotenv import load_dotenv
import os

load_dotenv()

url = "https://api.siliconflow.cn/v1/audio/transcriptions"

MODEL = "FunAudioLLM/SenseVoiceSmall" #TeleAI/TeleSpeechASR

files = { "file": open('./playground/voice-to-text/录音.mp3', 'rb') }
payload = { "model": MODEL }
headers = {"Authorization": f"Bearer {os.getenv('SILI_API_KEY')}"}

response = requests.post(url, data=payload, files=files, headers=headers)

print(response.json())
