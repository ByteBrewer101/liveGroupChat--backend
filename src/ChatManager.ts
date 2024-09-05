import { WebSocket } from "ws";

export class Room {
  private RoomId: string;
  private Users: WebSocket[] = [];

  constructor(rId: string) {
    this.RoomId = rId;
  }

  addUser(ws: WebSocket) {
    if (!this.Users.includes(ws)) {
      this.Users.push(ws);
      console.log(`User added to room ${this.RoomId}`);
    }
  }

  removeUser(ws: WebSocket) {
    this.Users = this.Users.filter((user) => user !== ws);
    console.log(`User removed from room ${this.RoomId}`);
  }

  getRoomId() {
    return this.RoomId;
  }

  sendMessage(currentUserWs: WebSocket, message: string) {
    this.Users.forEach((ws: WebSocket) => {
      if (ws !== currentUserWs && ws.readyState === WebSocket.OPEN) {
        try {
          ws.send(message);
        } catch (error) {
          console.error("Error sending message to user:", error);
          this.removeUser(ws); // Clean up if sending fails
        }
      }
    });
  }
}

export class RoomManager {
  public Rooms: Room[] = [];

  addNewRoom(room: Room) {
    this.Rooms.push(room);
    console.log(`New room created: ${room.getRoomId()}`);
  }

  addUserToRoom(rId: string, ws: WebSocket) {
    const room = this.Rooms.find((i) => i.getRoomId() === rId);
    if (room) {
      room.addUser(ws);
    } else {
      console.error(`Room ${rId} does not exist`);
      ws.send("Room does not exist");
    }
  }

  messageRoom(message: string, rId: string, currentws: WebSocket) {
    const currentRoom = this.Rooms.find((room) => room.getRoomId() === rId);
    if (currentRoom) {
      currentRoom.sendMessage(currentws, message);
    } else {
      console.error(`Room ${rId} does not exist`);
    }
  }

  deleteRoom(rId: string) {
    const roomExists = this.Rooms.some((room) => room.getRoomId() === rId);
    if (roomExists) {
      this.Rooms = this.Rooms.filter((room) => room.getRoomId() !== rId);
      console.log(`Room ${rId} deleted`);
    } else {
      console.error(`Room ${rId} does not exist`);
    }
  }
}
