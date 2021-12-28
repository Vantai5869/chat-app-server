import { createMessage } from './controllers/message';
import participantController, { createMultipleParticipants } from './controllers/participant';
import { checkRoom } from './controllers/room';
import { ISendMessage } from './types/ISendMessage';
import {io} from './main'
var OpenTok = require('opentok');

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

const emitToMany =(emitName,arrId,data)=> {
  for(let i = 0; i < arrId.length; i++){
    io.to(arrId[i]).emit(emitName,data);
  }
  return
};

const getOpentok=(data: ISendMessage)=>{
  const opentok = new OpenTok('47402891', '80eea7a73596b3e1414a74eaa1224f017b13a2bf');
  let sessionId;
  opentok.createSession({}, function(error, session) {
    if (error) {
      console.log("Error creating session:", error)
    } else {
      sessionId = session.sessionId;
      const token = opentok.generateToken(sessionId);
      emitToMany('call',data.userIds,{sessionId, token, data});
    }
  });
}


const SocketServer = (socket) => {

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
      emitToMany('getMessage',participants.length>0?participants:data?.userIds ,data)
    });
  
    //when disconnect
    socket.on("disconnect", () => {
      console.log("a user disconnected!");
      removeUser(socket.id);
      io.emit("getUsers", users);
    });
  
    // call
    socket.on("call", async (data: ISendMessage)=>{
      // tao mess
      const message =createMessage({...data, content:"đã bắt đầu cuộc gọi."})
      if(!message) socket.emit("resSendMessage",{success:false})
  
      if(data?.userIds){
        if(data.userIds?.length>0){
          getOpentok(data);
        }
      }
      else{
        const participants =await participantController.getParticipantIds(data.roomId);
        const dataTmp= {...data, userIds: participants}
        getOpentok(dataTmp);
      }
    })
  
} 

export default SocketServer