import { NextFunction, Request, Response } from 'express';
import mongoose  from 'mongoose';
import { MessageModel } from '../models/message';
import participantController from './participant';

const create = async (req: Request, res: Response, next: NextFunction)=> {
    let id = new mongoose.Types.ObjectId();
    if(req?.body?._id){
        id= req.body._id
    }
    const _message = new MessageModel({
        _id:id,
        ...req.body
    });
    try {
        const message= await  _message.save()
        if(message){
            return res.status(201).json({
                success:true,
                message: 'Create message successful',
                data: message,
            })
        }
        return res.status(404).json({
            success:false,
            message: 'create message not successful',
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
        await MessageModel.find()
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
            message: 'create message not successful',
        })
           
    }

};

const getOne = async(req: Request, res: Response, next: NextFunction)=> {
    try {
        const message= await MessageModel.findById(req.params.id)
        if(message){
            return res.status(200).json({
                success:true,
                message: 'get one message successful',
                data: message,
            })
        }
        return res.status(404).json({
            success:false,
            message: 'get one message not successful',
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
        const message= await MessageModel.findByIdAndUpdate({_id: req.params.id},req.body,{new: true})
        if(message){
            return res.status(200).json({
                success:true,
                message: 'updated message successful',
                data: message,
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
        const messageDie= await MessageModel.findByIdAndDelete(req.params.id)
        if(messageDie){
            return res.status(200).json({
                success:true,
                message: 'remove one message successful',
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

// get danh sach cac phong kem tin nhan cuoi cung
const getMessagesByUserId=async(req: Request, res: Response)=>{
    const rooms =[]
    const roomIds =req.body.roomIds
    for(let i=0; i<roomIds.length; i++){
        const roomid=roomIds[i]
        let room = await MessageModel.findOne({roomId:roomid})
        .populate({
            path: 'roomId',
            select:'name',
        }).populate('readBy', 'email avatar').lean()
        if(room){
            const avatars = await participantController.getAvatarForRoom(roomid, req.params.userId)
            let r: any=room
            r={...room, avatar:avatars}
            rooms.push(r)
        }
    }
    res.json(rooms)
}

// lay tat cac cac tin nhan trong phong
const getMessagesByRoomId=async(req: Request, res: Response)=>{
    const pageOptions = {
        page: +req.params.page || 0,
        limit: +req.params.limit || 10
    }
    
    try {
        const messages =await MessageModel.find({roomId: req.params.roomId},null,
        {sort:{_id:-1}, skip:pageOptions?.page * pageOptions?.limit, limit:pageOptions?.limit})
        .populate('readBy', 'email avatar')
        
        if(messages){
            return  res.status(200).json({
                success:true,
                message: `get success`,
                data: messages
            })
        }
        return res.status(500).json({err:"error"});
     
      
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: 'create message not successful',
        })
           
    }
}

export default {create, getByPage,getOne, update, remove,getMessagesByUserId,getMessagesByRoomId };
