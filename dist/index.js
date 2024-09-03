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
    console.log('running on ' + Date());
});
const wss = new ws_1.WebSocketServer({ server });
const roomManager = new ChatManager_1.RoomManager();
wss.on("connection", (ws) => {
    ws.send("user connected");
    ws.on("message", (message) => {
        const Message = JSON.parse(message);
        if (Message.type == "createRoom") {
            const currentRoom = new ChatManager_1.Room(Message.id);
            currentRoom.addUser(ws);
            ws.send("room Created");
        }
        if (Message.type == "joinRoom") {
            roomManager.adduserToRoom(Message.id, ws);
            ws.send("room Joined");
        }
        if (Message.type == "chat") {
            roomManager.messageRoom(Message.chat, Message.id);
        }
    });
});
