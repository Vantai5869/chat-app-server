import { createMessage } from './controllers/message';
import participantController, { createMultipleParticipants } from './controllers/participant';
import { checkRoom } from './controllers/room';
import { ISendMessage } from './types/ISendMessage';
import {io} from './main';
import userController from './controllers/user';
// firebase
var admin = require("firebase-admin");
var serviceAccount = require("./chatapp-307815-firebase-adminsdk-w4bvz-bedfef8acf.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

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

const emitToMany =(emitName:string,arrId:string[],data)=> {
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
      console.log('sessionId',sessionId)
      console.log('token',token)
      emitToMany('call',data.userIds,{sessionId, token, data});
    }
  });
}


const sendToUserDevice =(deviceId, message:ISendMessage)=> {
    admin.messaging().send({
        token: deviceId,
        data: {
            customData: "Deneme",
            id: "1",
            ad: "Yasin",
            subTitle: "Nodejs Bildirimiii"
        },
        android: {
            notification: {
                body: message.content,
                title: message.userId.username,
                color: "#fff566",
                priority: "high",
                sound: "default",
                vibrateTimingsMillis: [200, 500, 800],
                imageUrl: message.userId.avatar
            }
        }
    }).then((msg) => {
        console.log(msg)
    }).catch((err) => {
        console.log(err)
    })
  return
};


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
      // sendToUserDevice('eN-kLZGUQ624Vu38DS91Vq:APA91bE00V6AoWbc4naMStWhuS4LxRqpYuh2gMrehZI1zbfcLlJBQdblkNbwGj1F3R0wsgKi-QqSwfXeKNHKVNbRb4GDI_V2dUOvU6M7dySCh2Znn3o5Y9cU1CiXn9nMFBZ87FCu-P9D',data)
      sendToUserDevice('cP1ZBnQsQ7-7C-uongdRNS:APA91bFiFBSQzCzPt_awwmMn7kmga0aQGB0gb_dpFYCoqR0FTBkdg1axFJGItxuGzbB4NW_pVoV-eqBTi5WMkvh_J9EKdtgRuBKobOwAYBpZTXCQ8tYGYfQKLNHzZ_ceD-t6IlpF8MrY',data)
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

    // get and send QRCODE 
    socket.on('getQRCODE',()=>{
        socket.emit('getQRCODE',{qrcode:socket.id})
    })

    // Scan QR 
    socket.on('sCanQRCODE', data=>{
        io.to(data.clientId).emit('sCanQRCODE',{user:data.userData});
    })
  
    // verify
    socket.on('Verify',async data=>{
      const res= await userController.verify(data.idUser)
      socket.emit('verify',{success:res})
    })

    // endCall
    socket.on('EndCall', data=>{
      socket.emit('EndCall')
    })
} 

export default SocketServer