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
    removeUser(ws) { }
    getRoomId() {
        return this.RoomId;
    }
    sendMessage(message) {
        this.Users.forEach((ws) => {
            ws.send(message);
        });
    }
}
exports.Room = Room;
class RoomManager {
    constructor() {
        this.Rooms = [];
    }
    addNewRoom(Room) {
        this.Rooms.push(Room);
    }
    adduserToRoom(rId, ws) {
        this.Rooms.map((i) => {
            if (i.getRoomId() === rId) {
                i.addUser(ws);
            }
            ws.send("room does not exist");
        });
    }
    messageRoom(message, rId) {
        const currentRoom = this.Rooms.find((room) => {
            room.getRoomId() == rId;
        });
        currentRoom === null || currentRoom === void 0 ? void 0 : currentRoom.sendMessage(message);
    }
    deleteRoom(rId) {
        this.Rooms = this.Rooms.filter((room) => room.getRoomId() !== rId);
    }
}
exports.RoomManager = RoomManager;
