from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from redis import asyncio as aioredis
import os

api_app = FastAPI()

REDIS_CLIENT = aioredis.Redis(
        host=os.environ.get("REDIS_HOST", "localhost"),
        port=6379,
        password=os.environ.get("REDIS_PASSWORD", ""),
        ssl=True,
        decode_responses=True
    )

from app.routes import router
from app.socket_server import sio_app

api_app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_app.include_router(router)

main_app = FastAPI()
main_app.mount("/api", api_app)
main_app.mount("/", sio_app)  
