import { WebSocket } from "ws";

export class Room {
  private RoomId: string;
  private Users: WebSocket[] = [];

  constructor(rId: string) {
    this.RoomId = rId;
  }

  addUser(ws: WebSocket) {
    this.Users.push(ws);
  }

  removeUser(ws: WebSocket) {
    this.Users = this.Users.filter((user) => user !== ws);
  }

  getRoomId() {
    return this.RoomId;
  }

  sendMessage(currentUserWs: WebSocket, message: string) {
    this.Users.forEach((ws: WebSocket) => {
      if (ws !== currentUserWs) {
        ws.send(message);
      }
    });
  }
}

export class RoomManager {
  public Rooms: Room[] = [];

  addNewRoom(room: Room) {
   
    this.Rooms.push(room);
  }

  addUserToRoom(rId: string, ws: WebSocket) {
    
    const room = this.Rooms.find((i) => i.getRoomId() === rId); 
    if (room) {
      room.addUser(ws);
    } else {
      ws.send("Room does not exist"); 
    }
  }

  messageRoom(message: string, rId: string, currentws:WebSocket) {
    
    const currentRoom = this.Rooms.find((room) => room.getRoomId() === rId); 
    if (currentRoom) {
      currentRoom.sendMessage(currentws,message);
    } else {
      console.error("Room does not exist"); 
    }
  }

  deleteRoom(rId: string) {
    
    this.Rooms = this.Rooms.filter((room) => room.getRoomId() !== rId);
  }
}
