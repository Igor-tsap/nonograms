from typing import Optional
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from fastapi import Query
from .connection_manager import ConnectionManager
from . import service
from database.core import AsyncSessionLocal
from .schema import ChatMessageCreate



router = APIRouter(prefix="/api/chat", tags=["chat"])
connection_manager = ConnectionManager()




# @router.websocket("/ws/{room_id}")
# async def websocket_endpoint(websocket: WebSocket, room_id: str, token: Optional[str] = Query(default=None)):
#     await connection_manager.connect(websocket, room_id)
#     try:
#         async with AsyncSessionLocal() as db:
#             username = await service.get_username_from_token(db, token)
#             history = await service.get_chat_messages(db, room_id, limit=50)
#             for msg in history:
#                 await websocket.send_text(f"{msg.username}: {msg.message}")

#         print("CONNECTED", room_id)

#         while True:
#             data = await websocket.receive_text()
#             print("RECEIVED", data)
#             async with AsyncSessionLocal() as db:
#                 msg_data = ChatMessageCreate(username=username, message=data)
#                 await service.create_chat_message(db, room_id, msg_data)
#             await connection_manager.broadcast(f"{username}: {data}", room_id)
#     except WebSocketDisconnect:
#            connection_manager.disconnect(websocket, room_id)
#     except Exception as e:
#         import traceback
#         print("WS ERROR:", e)
#         traceback.print_exc()


@router.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str, token: Optional[str] = Query(default=None)):
    await connection_manager.connect(websocket, room_id)
    async with AsyncSessionLocal() as db:
        try:
        
            username = await service.get_username_from_token(db, token)
            history = await service.get_chat_messages(db, room_id, limit=50)
            for msg in history:
                await websocket.send_text(f"{msg.username}: {msg.message}")

            print("CONNECTED", room_id)

            while True:
                data = await websocket.receive_text()
                print("RECEIVED", data)
                
                await connection_manager.broadcast(f"{username}: {data}", room_id)
                msg_data = ChatMessageCreate(username=username, message=data)
                await service.create_chat_message(db, room_id, msg_data)
                
        except WebSocketDisconnect:
            connection_manager.disconnect(websocket, room_id)
        except Exception as e:
            import traceback
            print("WS ERROR:", e)
            traceback.print_exc()