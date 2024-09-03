"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomManager = exports.Room = void 0;
class Room {
    constructor(rId) {
        this.Users = [];
        this.RoomId = rId;
    }
    addUser(ws) {
        this.Users.push(ws);
    }
    removeUser(ws) {
        this.Users = this.Users.filter((user) => user !== ws);
    }
    getRoomId() {
        return this.RoomId;
    }
    sendMessage(currentUserWs, message) {
        this.Users.forEach((ws) => {
            if (ws !== currentUserWs) {
                ws.send(message);
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
    }
    addUserToRoom(rId, ws) {
        const room = this.Rooms.find((i) => i.getRoomId() === rId);
        if (room) {
            room.addUser(ws);
        }
        else {
            ws.send("Room does not exist");
        }
    }
    messageRoom(message, rId, currentws) {
        const currentRoom = this.Rooms.find((room) => room.getRoomId() === rId);
        if (currentRoom) {
            currentRoom.sendMessage(currentws, message);
        }
        else {
            console.error("Room does not exist");
        }
    }
    deleteRoom(rId) {
        this.Rooms = this.Rooms.filter((room) => room.getRoomId() !== rId);
    }
}
exports.RoomManager = RoomManager;
