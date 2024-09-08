import { WebSocket } from "ws";

export class User {
  private username: string;
  private usersocket: WebSocket;

  constructor(username: string, ws: WebSocket) {
    (this.username = username), (this.usersocket = ws);
  }
}
