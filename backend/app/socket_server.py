import socketio
from app.main import REDIS_CLIENT as redis


sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins="*")
sio_app = socketio.ASGIApp(sio)

def room_key(room_id): return f"room:{room_id}"
def code_key(room_id): return f"{room_key(room_id)}:code"
def users_key(room_id): return f"{room_key(room_id)}:users"
def host_key(room_id): return f"{room_key(room_id)}:host"

@sio.event
async def connect(sid, environ):
    print(f"🔌 Client connected: {sid}")

@sio.event
async def join(sid, data):
    room = data["room"]
    username = data.get("username", "Anonymous")
    await sio.enter_room(sid, room)

    await redis.hset(users_key(room), sid, username)

    is_host = await redis.exists(host_key(room)) == 0
    if is_host:
        await redis.set(host_key(room), sid)

    code = await redis.get(code_key(room)) or ""
    await sio.emit("code_sync", {
        "code": code,
        "language": "javascript"
    }, room=sid)

    await sio.emit("your_sid", {"sid": sid}, room=sid)

    await sio.emit("user_joined", username, room=room, skip_sid=sid)

    users = await redis.hgetall(users_key(room))
    await sio.emit("participants", users, room=room)

@sio.event
async def code_change(sid, data):
    room = data["room"]
    code = data["code"]
    await redis.set(code_key(room), code)

    await sio.emit("code_update", {
        "code": code,
        "language": data["language"]
    }, room=room, skip_sid=sid)

@sio.event
async def disconnect(sid):
    for key in await redis.keys("room:*:users"):
        room = key.split(":")[1]
        if await redis.hexists(users_key(room), sid):
            username = await redis.hget(users_key(room), sid)

            await sio.emit("user_left", username, room=room)

            await redis.hdel(users_key(room), sid)
            await sio.leave_room(sid, room)

            current_host = await redis.get(host_key(room))
            if sid == current_host:
                users = await redis.hkeys(users_key(room))
                if users:
                    await redis.set(host_key(room), users[0])
                else:
                    await redis.delete(host_key(room))
                    await redis.delete(users_key(room))
                    await redis.delete(code_key(room))
                    return

            users = await redis.hgetall(users_key(room))
            await sio.emit("participants", users, room=room)
            break

@sio.event
async def chat_message(sid, data):
    room = data["room"]
    message = data["message"]
    sender = await redis.hget(users_key(room), sid) or "Unknown"

    await sio.emit("chat_message", {
        "sender": sender,
        "sender_sid": sid,
        "message": message,
    }, room=room)
