
import google.generativeai as genai
import os

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.5-flash")

SYSTEM_PROMPT = """You are a helpful assistant in a nonogram puzzle chat room.
Players may ask for hints, logic explanations, or just chat.
Keep responses very short and friendly. Answear in ukranian when asked in ukrainian or russian."""


ERROR_MESSAGES = {
    "en": "Sorry, something went wrong",
    "uk": "Вибач, щось пішло не так",
}

async def get_ai_response(user_message: str, username: str, locale: str = "en") -> str:
    try:
        prompt = f"{SYSTEM_PROMPT}\n\n{username} says: {user_message}"
        response = await model.generate_content_async(prompt)
        return response.text
    except Exception as e:
        print(f"[ai_service] error: {e}")
        return ERROR_MESSAGES.get(locale, ERROR_MESSAGES["en"])