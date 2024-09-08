import { sendMessage } from "../ChatManager";
import { User } from "./User";
import { WebSocket } from "ws";

export class Room2 {
  private RoomId: string;
  private UserMap: Map<WebSocket, string> = new Map();

  constructor(rId: string) {
    this.RoomId = rId;
  }

  getRoomId() {
    return this.RoomId;
  }

  broadCastMessage(message: string, username: string, senderWs: WebSocket) {
    this.UserMap.forEach((id, ws) => {
      if (ws !== senderWs && ws.readyState === WebSocket.OPEN) {
        sendMessage(ws, username, message);
      }
    });
  }

  addUser(ws: WebSocket, username: string) {
    const currentUser = new User(username, ws);
    if (!this.UserMap.get(ws)) {
      this.UserMap.set(ws, username);
      sendMessage(ws, "system", "Connected to " + this.RoomId);
    } else {
      sendMessage(ws, "system", "you already are in this room");
    }
  }
}
