"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ws_1 = require("ws");
const RoomManager_1 = require("./Classes/RoomManager");
const ChatManager_1 = require("./ChatManager");
const app = (0, express_1.default)();
const port = process.env.PORT_APPLICATION || 3000;
const server = app.listen(port, () => {
    console.log("running on " + Date());
});
const wss = new ws_1.WebSocketServer({ server });
const roomManager = new RoomManager_1.RoomManager2();
wss.on("connection", (ws) => {
    (0, ChatManager_1.sendMessage)(ws, "system", "You are connected");
    ws.on("message", (msg) => {
        const currentMessage = JSON.parse(msg);
        (0, ChatManager_1.handleRoomMessage)(currentMessage, ws, roomManager);
    });
    ws.on("close", () => {
        console.log("User disconnected now");
        roomManager.Rooms.forEach((room) => {
            room.removeUser(ws);
        });
    });
});
