"""REST endpoints intended for ElevenLabs tool calls.

The voice agent uses the same doctors, availability, booking and cancellation
routes as the web client; no voice-specific business rules live here.
"""
from .appointments import router as appointments_router
from .doctors import router as doctors_router

__all__ = ["appointments_router", "doctors_router"]
