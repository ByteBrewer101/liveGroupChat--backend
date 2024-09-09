import { WebSocket } from "ws";
import { RoomManager2 } from "./Classes/RoomManager";


interface Message{
type:string,
id:string,
username:string,
chat:string
}


export function handleRoomMessage(currentMessage:Message, ws:WebSocket, roomManager:RoomManager2) {
  const { type, id, username, chat } = currentMessage;

  // Handle room creation
  if (type === "createRoom") {
    if (roomManager.Rooms.get(id)) {
      sendMessage(ws, "system", "This Room already Exists");
    } else {
      const currentRoom = roomManager.createRoom(id);
      currentRoom.addUser(ws, username);
    }
  }

  // Handle joining a room
  if (type === "joinRoom") {
    if (!roomManager.Rooms.get(id)) {
      sendMessage(ws, "system", "Room does not exist");
    } else {
      roomManager.Rooms.get(id)?.addUser(ws, username);
      const msg1 = username + " has joined the room"
      roomManager.Rooms.get(id)?.broadCastMessage(msg1,username,ws)
    }
  }

  // Handle chat messages
  if (type === "chat") {
    if (!roomManager.Rooms.get(id)) {
      sendMessage(ws, "system", "Room Does Not Exist");
    } else {
      roomManager.deliverMessage(id, chat,username,ws);
    }
  }
}


export function sendMessage(ws:WebSocket,rece:string,msg:string)
{
 return ws.send(JSON.stringify({
    "recepient": rece,
    "message":msg
  }))
} 







