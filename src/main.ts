import {app} from './app'
import http from 'http'
import mongoose from "mongoose";
import logging from './config/logging';
import config from './config/config';
import participantController, { createMultipleParticipants } from './controllers/participant';
import { ISendMessage } from './types/ISendMessage';
import { checkRoom } from './controllers/room';
import { createMessage } from './controllers/message';
require('dotenv').config()

const NAMESPACE = 'Server';
const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server, { 
  cors: {
    origin: '*',
  }
});

const PORT = process.env.PORT || '8080'
server.on('connection',()=>{
    console.log('connection '+PORT)
})

server.listen(PORT,()=>console.info(`listening port ${PORT}: http://localhost:${PORT}`))
server.on('listening', async () => {
	mongoose
    .connect(config.mongo.url, config.mongo.options)
    .then((result) => {
        logging.info(NAMESPACE, 'Mongo Connected');
    })
    .catch((error) => {
        logging.error(NAMESPACE, error.message, error);
    });
	mongoose.connection.on('open', () => {
		console.info('Connected to Mongo.');
	});
	mongoose.connection.on('error', (err: any) => {
		console.error(err);
	});
});


let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
    console.log(users);
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

const emitToMany =(arrId,data)=> {
  for(let i = 0; i < arrId.length; i++){
    io.to(arrId[i]).emit("getMessage",data);
  }
  return
};

io.on("connection", (socket) => {
  socket.emit("ping")
  //when ceonnect
  console.log("=>=======>a user connected.");

  //take userId and socketId from user
  socket.on("JOIN_ROOM", (userId) => {
    console.log("=> đã join"+userId)
    addUser(userId, socket.id);
    socket.join(userId);
    // io.emit("getUsers", users);
  });

  //send and get message
  socket.on("sendMessage",async (data: ISendMessage) => {

    /**
     * b1 kiem tra  roomId co trong db chua
     * b2 neu co thi nghia la can kiem tra xem nhung user trong userIds co phong hay chua 
     * b3 chưa co phong thi tao phong=>them vao phong. neu co roi thi sang tao tin nhan
     */
    const isExist = await checkRoom(data)
    if(isExist=='err'){
      socket.emit("resSendMessage",{success:false})
    }else if(isExist){

      // tao mess
      const message =createMessage(data)
      if(!message) socket.emit("resSendMessage",{success:false})
    }else{
      // add nguoi dung vao nhom
      createMultipleParticipants(data)

      // tao mess
      const message =createMessage(data)
      if(message) socket.emit("resSendMessage",{success:false})
    }
    const participants =await participantController.getParticipantIds(data.roomId);
    emitToMany(participants.length>0?participants:data?.userIds ,data)
  });

  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});