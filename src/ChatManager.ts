import { WebSocket } from "ws";

export class Room {
  private RoomId: String;
  private Users: WebSocket[] = [];

  constructor(rId: String) {
    this.RoomId = rId;
  }

  addUser(ws: WebSocket) {
    this.Users.push(ws);
  }

  removeUser(ws: WebSocket) {}

  getRoomId() {
    return this.RoomId;
  }

  sendMessage(message: String) {
    this.Users.forEach((ws: WebSocket) => {
      ws.send(message)
    });
  }
}

export class RoomManager {
  private Rooms: Room[] = [];

  addNewRoom(Room: Room) {
    this.Rooms.push(Room);
  }

  adduserToRoom(rId: String, ws: WebSocket) {
    this.Rooms.map((i) => {
      if (i.getRoomId() === rId) {
        i.addUser(ws);
      }
      ws.send("room does not exist");
    });
  }

  messageRoom(message: String, rId: String) {
    const currentRoom = this.Rooms.find((room) => {
      room.getRoomId() == rId;
    });
    currentRoom?.sendMessage(message)
    
  }

  deleteRoom(rId: String) {
    this.Rooms = this.Rooms.filter((room) => room.getRoomId() !== rId);
  }
}






