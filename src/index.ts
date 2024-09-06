import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import { Room, RoomManager, sendMessage } from "./ChatManager";

const app = express();

const port = process.env.PORT_APPLICATION || 3000

const server = app.listen(port, () => {
  console.log("running on " + Date());
});

const wss = new WebSocketServer({ server });
const roomManager = new RoomManager();

wss.on("connection", (ws) => {
  sendMessage(ws,"system","You are connected")


  ws.on("message", (message: string) => {
    const Message = JSON.parse(message);

    if(Message.id.trim()===""){
     sendMessage(ws,"system","Invalid Room id")
    }

    if (Message.type === "createRoom") {
      const existingRoom = roomManager.Rooms.find(
        (room) => room.getRoomId() === Message.id
      );
      if (existingRoom) {
        sendMessage(ws,"system","Room already exists")

      } else {
        const currentRoom = new Room(Message.id);
        roomManager.addNewRoom(currentRoom);
        currentRoom.addUser(ws);
        sendMessage(ws,"system","Room created")
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
