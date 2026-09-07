from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings
from .database import SessionLocal, init_db
from .routers.appointments import router as appointments_router
from .routers.doctors import router as doctors_router
from .seed import seed_doctors


@asynccontextmanager
async def lifespan(_: FastAPI):
    init_db()
    with SessionLocal() as db:
        seed_doctors(db)
    yield


settings = get_settings()
app = FastAPI(title=settings.app_name, version="1.0.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(doctors_router)
app.include_router(appointments_router)


@app.get("/health", tags=["system"], include_in_schema=False)
@app.get("/api/health", tags=["system"], summary="Check API health")
def health() -> dict[str, str]:
    return {"status": "ok"}
