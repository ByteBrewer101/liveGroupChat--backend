"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ws_1 = require("ws");
const ChatManager_1 = require("./ChatManager");
const app = (0, express_1.default)();
const port = process.env.PORT_APPLICATION || 3000;
const server = app.listen(port, () => {
    console.log("running on " + Date());
});
const wss = new ws_1.WebSocketServer({ server });
const roomManager = new ChatManager_1.RoomManager();
wss.on("connection", (ws) => {
    (0, ChatManager_1.sendMessage)(ws, "system", "You are connected");
    ws.on("message", (message) => {
        const Message = JSON.parse(message);
        if (Message.id.trim() === "") {
            (0, ChatManager_1.sendMessage)(ws, "system", "Invalid Room id");
        }
        if (Message.type === "createRoom") {
            const existingRoom = roomManager.Rooms.find((room) => room.getRoomId() === Message.id);
            if (existingRoom) {
                (0, ChatManager_1.sendMessage)(ws, "system", "Room already exists");
            }
            else {
                const currentRoom = new ChatManager_1.Room(Message.id);
                roomManager.addNewRoom(currentRoom);
                currentRoom.addUser(ws);
                (0, ChatManager_1.sendMessage)(ws, "system", "Room created");
            }
        }
        if (Message.type === "joinRoom") {
            roomManager.addUserToRoom(Message.id, ws);
            console.log("user joined");
        }
        if (Message.type === "chat") {
            roomManager.messageRoom(Message.chat, Message.id, ws);
        }
    });
    ws.on("close", () => {
        console.log("User disconnected now");
    });
});
