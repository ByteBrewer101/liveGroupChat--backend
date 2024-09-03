import express from "express";
import { WebSocketServer,WebSocket } from "ws";
import { Room, RoomManager } from "./ChatManager";



const app = express()




const server = app.listen(3000,()=>{
    console.log('running on ' + Date());
})


const wss = new WebSocketServer({ server });
const roomManager = new RoomManager()

wss.on("connection",(ws)=>{
  ws.send("user connected")

  ws.on("message",(message:string)=>{

    const Message = JSON.parse(message);

    if(Message.type == "createRoom"){
      const currentRoom = new Room(Message.id)
      currentRoom.addUser(ws)
      ws.send("room Created")
    }

    if(Message.type =="joinRoom"){
      roomManager.adduserToRoom(Message.id,ws)
      ws.send("room Joined")
    }

    if(Message.type == "chat"){
      roomManager.messageRoom(Message.chat,Message.id)
     
    }

    

  })


});


