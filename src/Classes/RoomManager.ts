import { sendMessage } from "../ChatManager";
import { Room2 } from "./Room";
import { WebSocket } from "ws";

export class RoomManager2 {
  public Rooms: Map<string, Room2> = new Map();

  createRoom(RoomId: string) {

    const currentRoom = new Room2(RoomId);
    this.Rooms.set(RoomId, currentRoom);
    return currentRoom
  }

  deliverMessage(roomId: string, message: string,username:string,ws:WebSocket) {
    const currentRoom = this.Rooms.get(roomId);
    currentRoom?.broadCastMessage(message,username,ws);
  }

  joinRoom(RoomId: string, username: string, ws: WebSocket) {
    const currentRoom = this.Rooms.get(RoomId);
    if (currentRoom) {
      currentRoom.addUser(ws, username);
    } else {
      sendMessage(ws, "system", "Room Does not Exist");
    }
  }

}
