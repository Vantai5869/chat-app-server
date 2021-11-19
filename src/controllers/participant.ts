import { NextFunction, Request, Response } from 'express';
import { ParticipantModel } from '../models/participant';
import mongoose  from 'mongoose';

const create = async (req: Request, res: Response, next: NextFunction)=> {
    const _participant = new ParticipantModel({
        _id: new mongoose.Types.ObjectId(),
        ...req.body
    });
    try {
        const participant= await  _participant.save()
        if(participant){
            return res.status(201).json({
                success:true,
                message: 'Create participant successful',
                data: participant,
            })
        }
        return res.status(404).json({
            success:false,
            message: 'create participant not successful',
        })
     
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: error.message,
        })
    }
    
};

const getByPage = async(req: Request, res: Response) => {
    const pageOptions = {
        page: +req.params.page || 0,
        limit: +req.params.limit || 10
    }
    
    try {
        await ParticipantModel.find()
        .skip(pageOptions?.page * pageOptions?.limit)
        .limit(pageOptions.limit)
        .exec(function (err, doc) {
        if(err) { res.status(500).json(err); return; };
        return  res.status(200).json({
                success:true,
                message: `get success`,
                data: doc,
            })
        });
      
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: 'create participant not successful',
        })
           
    }

};

const getOne = async(req: Request, res: Response, next: NextFunction)=> {
    try {
        const participant= await ParticipantModel.findById(req.params.id)
        if(participant){
            return res.status(200).json({
                success:true,
                message: 'get one participant successful',
                data: participant,
            })
        }
        return res.status(404).json({
            success:false,
            message: 'get one participant not successful',
        })
      
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: error.message,
        })
    }

};

const update = async(req: Request, res: Response, next: NextFunction)=> {
    try {
        const participant= await ParticipantModel.findByIdAndUpdate({_id: req.params.id},req.body,{new: true})
        if(participant){
            return res.status(200).json({
                success:true,
                message: 'update participant successful',
                data: participant,
            })
        }
        return res.status(200).json({
            success:false,
            message: 'can not find',
        })
      
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: error.message,
        })
    }

};
const remove = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const participantDie= await ParticipantModel.findByIdAndDelete(req.params.id)
        if(participantDie){
            return res.status(200).json({
                success:true,
                message: 'remove one participant successful',
            })
        }
        return res.status(200).json({
            success:false,
            message: 'can not find',
        })
      
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: error.message,
        })
    }

};




const getRoomIdsByPage = async(req: Request, res: Response, next: NextFunction) => {
    const pageOptions = {
        page: +req.params.page || 0,
        limit: +req.params.limit || 10
    }
    
    try {
        const roomIds = await ParticipantModel.find({userId: req.params.userId},null,
        {sort:{updatedAt:-1}, skip:pageOptions?.page * pageOptions?.limit, limit:pageOptions?.limit})
        req.body.roomIds =roomIds.map(item=>item.roomId)
        next()
      
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: 'create participant not successful',
        })
           
    }

};

const getInfoForRoom=async(roomId:string, userId:string)=>{
        const participants = await ParticipantModel.find({roomId:roomId},null,{sort:{updatedAt:-1},limit:2,where: {userId:{ $ne: userId }}})
        .populate(
            {
                path: 'userId',
                select: 'avatar username',
                
            })
        let avatar=[]
        let name=''
        for(let i = 0; i < participants.length; i++) {
            let a: any
            a= participants[i].userId
            name+=a?.username
            avatar.push(a.avatar)
        }
        return {avatar,name}
}

// sap xep lai cho phong co tin nhan moi noi len tren
const updateOder= async(roomId) =>{
    let update:any= Date.now().toString()
    try {
       const x= await ParticipantModel.updateMany({roomId: roomId},{updatedAt:update},{new: true})
    } catch (error) {
      console.error(error)
    }
}


const getInfoUserOfRoom=async(roomId:string, userId:string)=>{
    const participants = await ParticipantModel.find({roomId:roomId},null,{sort:{updatedAt:-1},limit:2,where: {userId:{ $ne: userId }}})
    .populate(
        {
            path: 'userId',
            select: 'avatar username phone',
        })
    if(participants.length==1){
        let a: any
        a= participants[0].userId
        const {_id,avatar,phone, username:name}= a
        return {_id, avatar, phone, name}
    }
    else return null
}


export default {
    create, 
    getByPage,
    getOne, 
    update, 
    remove,
    getRoomIdsByPage,
    getInfoForRoom,
    updateOder,
    getInfoUserOfRoom
     };
