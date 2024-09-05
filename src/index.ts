import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import { Room, RoomManager } from "./ChatManager";

const app = express();

const port = process.env.PORT_APPLICATION || 3000

const server = app.listen(port, () => {
  console.log("running on " + Date());
});

const wss = new WebSocketServer({ server });
const roomManager = new RoomManager();

wss.on("connection", (ws) => {
  ws.send("User connected");

  ws.on("message", (message: string) => {
    const Message = JSON.parse(message);

    if (Message.type === "createRoom") {
      const existingRoom = roomManager.Rooms.find(
        (room) => room.getRoomId() === Message.id
      );
      if (existingRoom) {
        ws.send("Room already exists");
      } else {
        const currentRoom = new Room(Message.id);
        roomManager.addNewRoom(currentRoom);
        currentRoom.addUser(ws);
        ws.send("Room created");
      }
    }

    if (Message.type === "joinRoom") {
      roomManager.addUserToRoom(Message.id, ws);
      console.log("user joined");
    }

    if (Message.type === "chat") {
      roomManager.messageRoom(Message.chat, Message.id,ws);
    }
  });

  ws.on("close", () => {
    console.log("User disconnected now");
  });
});
