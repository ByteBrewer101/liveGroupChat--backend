"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room2 = void 0;
const ChatManager_1 = require("../ChatManager");
const User_1 = require("./User");
const ws_1 = require("ws");
class Room2 {
    constructor(rId) {
        this.UserMap = new Map();
        this.RoomId = rId;
    }
    getRoomId() {
        return this.RoomId;
    }
    broadCastMessage(message, username, senderWs) {
        this.UserMap.forEach((id, ws) => {
            if (ws !== senderWs && ws.readyState === ws_1.WebSocket.OPEN) {
                (0, ChatManager_1.sendMessage)(ws, username, message);
            }
        });
    }
    addUser(ws, username) {
        const currentUser = new User_1.User(username, ws);
        if (!this.UserMap.get(ws)) {
            this.UserMap.set(ws, username);
            (0, ChatManager_1.sendMessage)(ws, "system", "Connected to " + this.RoomId);
        }
        else {
            (0, ChatManager_1.sendMessage)(ws, "system", "you already are in this room");
        }
    }
}
exports.Room2 = Room2;
