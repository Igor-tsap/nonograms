from fastapi import WebSocket


class ConnectionManager:
    def __init__(self):
        self.connections = {}

    async def connect(self, websocket: WebSocket, room_id: str):
        await websocket.accept()
        if room_id not in self.connections:
            self.connections[room_id] = set()
        self.connections[room_id].add(websocket)

    def disconnect(self, websocket: WebSocket, room_id: str):
        if room_id in self.connections:   
            if websocket in self.connections[room_id]:
                self.connections[room_id].discard(websocket)

                if not self.connections[room_id]:
                    del self.connections[room_id]

    async def broadcast(self, message: str, room_id: str):
        dead_connections = []

        for connection in self.connections.get(room_id, set()):
            try:
                await connection.send_text(message)
            except Exception as e:
                print("broadcast error:", e)
                dead_connections.append(connection)

        for connection in dead_connections:
            self.disconnect(connection, room_id)