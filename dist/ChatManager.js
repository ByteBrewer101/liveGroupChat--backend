"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomManager = exports.Room = void 0;
exports.sendMessage = sendMessage;
const ws_1 = require("ws");
class Room {
    constructor(rId) {
        this.Users = [];
        this.RoomId = rId;
    }
    addUser(ws) {
        if (!this.Users.includes(ws)) {
            this.Users.push(ws);
            console.log(`User added to room ${this.RoomId}`);
        }
        else {
            sendMessage(ws, "system", "already joined");
        }
    }
    removeUser(ws) {
        this.Users = this.Users.filter((user) => user !== ws);
        console.log(`User removed from room ${this.RoomId}`);
    }
    getRoomId() {
        return this.RoomId;
    }
    sendMessage(currentUserWs, message) {
        this.Users.forEach((ws) => {
            if (ws !== currentUserWs && ws.readyState === ws_1.WebSocket.OPEN) {
                try {
                    sendMessage(ws, "user", message);
                }
                catch (error) {
                    console.error("Error sending message to user:", error);
                    this.removeUser(ws); // Clean up if sending fails
                }
            }
        });
    }
}
exports.Room = Room;
class RoomManager {
    constructor() {
        this.Rooms = [];
    }
    addNewRoom(room) {
        this.Rooms.push(room);
        console.log(`New room created: ${room.getRoomId()}`);
    }
    addUserToRoom(rId, ws) {
        const room = this.Rooms.find((i) => i.getRoomId() === rId);
        if (room) {
            room.addUser(ws);
        }
        else {
            console.error(`Room ${rId} does not exist`);
            sendMessage(ws, "system", "Room does not exist");
        }
    }
    messageRoom(message, rId, currentws) {
        const currentRoom = this.Rooms.find((room) => room.getRoomId() === rId);
        if (currentRoom) {
            currentRoom.sendMessage(currentws, message);
        }
        else {
            console.error(`Room ${rId} does not exist`);
        }
    }
    deleteRoom(rId) {
        const roomExists = this.Rooms.some((room) => room.getRoomId() === rId);
        if (roomExists) {
            this.Rooms = this.Rooms.filter((room) => room.getRoomId() !== rId);
            console.log(`Room ${rId} deleted`);
        }
        else {
            console.error(`Room ${rId} does not exist`);
        }
    }
}
exports.RoomManager = RoomManager;
function sendMessage(ws, rece, msg) {
    return ws.send(JSON.stringify({
        "recepient": rece,
        "message": msg
    }));
}
