import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def transcribe_audio(audio_bytes: bytes, language: str = "en") -> dict:
    """
    Agent 0 — Transcriber
    Converts audio to text using Groq Whisper large-v3.

    Supports:
    - English (language="en")
    - Amharic (language="am")
    - Auto-detect (language=None)

    Returns:
        {
            "transcript": "the transcribed text",
            "language": "en" or "am",
            "duration": 12.5  (seconds)
        }
    """
    try:
        transcription = client.audio.transcriptions.create(
            file=("recording.webm", audio_bytes),
            model="whisper-large-v3",
            language=language if language != "auto" else None,
            response_format="verbose_json",  # gives us duration + language info
        )

        return {
            "transcript": transcription.text,
            "language": getattr(transcription, "language", language),
            "duration": getattr(transcription, "duration", 0),
        }

    except Exception as e:
        raise Exception(f"Transcription failed: {str(e)}")


def transcribe_audio_simple(audio_bytes: bytes, language: str = "en") -> str:
    """
    Simplified version — returns just the transcript text.
    Used when you only need the text, not metadata.
    """
    result = transcribe_audio(audio_bytes, language)
    return result["transcript"]


# ── TEST ──────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("Transcriber agent ready.")
    print("Supported languages: English (en), Amharic (am), Auto-detect (auto)")
