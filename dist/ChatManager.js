"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRoomMessage = handleRoomMessage;
exports.sendMessage = sendMessage;
function handleRoomMessage(currentMessage, ws, roomManager) {
    var _a, _b;
    const { type, id, username, chat } = currentMessage;
    // Handle room creation
    if (type === "createRoom") {
        if (roomManager.Rooms.get(id)) {
            sendMessage(ws, "system", "This Room already Exists");
        }
        else {
            const currentRoom = roomManager.createRoom(id);
            currentRoom.addUser(ws, username);
        }
    }
    // Handle joining a room
    if (type === "joinRoom") {
        if (!roomManager.Rooms.get(id)) {
            sendMessage(ws, "system", "Room does not exist");
        }
        else {
            (_a = roomManager.Rooms.get(id)) === null || _a === void 0 ? void 0 : _a.addUser(ws, username);
            const msg1 = username + " has joined the room";
            (_b = roomManager.Rooms.get(id)) === null || _b === void 0 ? void 0 : _b.broadCastMessage(msg1, username, ws);
        }
    }
    // Handle chat messages
    if (type === "chat") {
        if (!roomManager.Rooms.get(id)) {
            sendMessage(ws, "system", "Room Does Not Exist");
        }
        else {
            roomManager.deliverMessage(id, chat, username, ws);
        }
    }
}
function sendMessage(ws, rece, msg) {
    return ws.send(JSON.stringify({
        "recepient": rece,
        "message": msg
    }));
}
