"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomManager2 = void 0;
const ChatManager_1 = require("../ChatManager");
const Room_1 = require("./Room");
class RoomManager2 {
    constructor() {
        this.Rooms = new Map();
    }
    createRoom(RoomId) {
        const currentRoom = new Room_1.Room2(RoomId);
        this.Rooms.set(RoomId, currentRoom);
        return currentRoom;
    }
    deliverMessage(roomId, message, username, ws) {
        const currentRoom = this.Rooms.get(roomId);
        currentRoom === null || currentRoom === void 0 ? void 0 : currentRoom.broadCastMessage(message, username, ws);
    }
    joinRoom(RoomId, username, ws) {
        const currentRoom = this.Rooms.get(RoomId);
        if (currentRoom) {
            currentRoom.addUser(ws, username);
        }
        else {
            (0, ChatManager_1.sendMessage)(ws, "system", "Room Does not Exist");
        }
    }
}
exports.RoomManager2 = RoomManager2;
