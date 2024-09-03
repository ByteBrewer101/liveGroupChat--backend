"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ws_1 = require("ws");
const ChatManager_1 = require("./ChatManager");
const app = (0, express_1.default)();
const server = app.listen(3000, () => {
    console.log("running on " + Date());
});
const wss = new ws_1.WebSocketServer({ server });
const roomManager = new ChatManager_1.RoomManager();
wss.on("connection", (ws) => {
    ws.send("User connected");
    ws.on("message", (message) => {
        const Message = JSON.parse(message);
        if (Message.type === "createRoom") {
            const existingRoom = roomManager.Rooms.find((room) => room.getRoomId() === Message.id);
            if (existingRoom) {
                ws.send("Room already exists");
            }
            else {
                const currentRoom = new ChatManager_1.Room(Message.id);
                roomManager.addNewRoom(currentRoom);
                currentRoom.addUser(ws);
                ws.send("Room created");
            }
        }
        if (Message.type === "joinRoom") {
            roomManager.addUserToRoom(Message.id, ws);
        }
        if (Message.type === "chat") {
            roomManager.messageRoom(Message.chat, Message.id, ws);
        }
    });
    ws.on("close", () => {
        console.log("User disconnected");
    });
});
