from fastapi import APIRouter
from uuid import uuid4
from app.main import REDIS_CLIENT as redis

router = APIRouter()

def users_key(room_id): return f"room:{room_id}:users"

@router.post("/room/create")
async def create_room():
    room_id = str(uuid4())
    return {"roomId": room_id}

@router.get("/room/exists/{room_id}")
async def check_room_exists(room_id: str):
    exists = await redis.exists(users_key(room_id))
    return {"exists": bool(exists)}
