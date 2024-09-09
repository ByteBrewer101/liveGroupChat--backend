import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import { RoomManager2 } from "./Classes/RoomManager";
import { handleRoomMessage, sendMessage } from "./ChatManager";

const app = express();

const port = process.env.PORT_APPLICATION || 3000;

const server = app.listen(port, () => {
  console.log("running on " + Date());
});

const wss = new WebSocketServer({ server });
const roomManager = new RoomManager2();

wss.on("connection", (ws) => {
  sendMessage(ws, "system", "You are connected");

  ws.on("message", (msg: string) => {
    const currentMessage = JSON.parse(msg);

    handleRoomMessage(currentMessage, ws, roomManager);
  });

  ws.on("close", () => {
    console.log("User disconnected now");
    roomManager.Rooms.forEach((room) => {
      room.removeUser(ws); 
    });
  });
});
