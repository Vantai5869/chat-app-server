import { NextFunction, Request, Response } from 'express';
import { RoomModel } from '../models/room';
import mongoose  from 'mongoose';
import { ISendMessage } from '../types/ISendMessage';

const create = async (req: Request, res: Response, next: NextFunction)=> {
    let id = new mongoose.Types.ObjectId();
    if(req?.body?._id){
        id= req.body._id
    }
    const _room = new RoomModel({
        _id: id,
        ...req.body
    });
    try {
        const room= await  _room.save()
        if(room){
            return res.status(201).json({
                success:true,
                message: 'Create room successful',
                data: room,
            })
        }
        return res.status(404).json({
            success:false,
            message: 'create room not successful',
        })
     
    } catch (error) {
        console.error(error)
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
        await RoomModel.find()
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
            message: 'create room not successful',
        })
           
    }

};

const getOne = async(req: Request, res: Response, next: NextFunction)=> {
    try {
        const room= await RoomModel.findById(req.params.id)
        if(room){
            return res.status(200).json({
                success:true,
                message: 'get one room successful',
                data: room,
            })
        }
        return res.status(404).json({
            success:false,
            message: 'get one room not successful',
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
        const room= await RoomModel.findByIdAndUpdate({_id: req.params.id},req.body,{new: true})
        if(room){
            return res.status(200).json({
                success:true,
                message: 'updated room successful',
                data: room,
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
        const roomDie= await RoomModel.findByIdAndDelete(req.params.id)
        if(roomDie){
            return res.status(200).json({
                success:true,
                message: 'remove one room successful',
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


const checkExist = async(req: Request, res: Response, next: NextFunction) => {
    // xem có roomId truyền lên hay khong
    if(req.body?.roomId) {
        const checkRoom = await RoomModel.findOne({_id: req.body.roomId});
        if(checkRoom?._id) {
            console.log(checkRoom)
            req.body.isHaveRoom = true;
            next()
            return 
        }
        const roomId = req.body.roomId
        console.log(roomId)
        const IdArr = req.body.userIds
        const _room = new RoomModel({
            _id: roomId.toString(),
            createBy: req.body.userId._id,
            admins:IdArr?.length==2? IdArr:req.body.userId._id ,
            avatar: req.body?.roomAvatar,
            name : req.body?.roomName
        });
        try {
            const res = await _room.save()
            console.log(res)
        } catch (error) {
            console.log(error)
            res.status(500)
        }
        next()
    }
    else{
        res.status(500)
    }

};

export const  checkRoom = async(data: ISendMessage) => {
    // xem có roomId truyền lên hay khong
    if(data?.roomId) {
        const checkRoom = await RoomModel.findOne({_id: data.roomId});
        if(checkRoom?._id) {
            return true
        }
        const roomId = data.roomId
        const IdArr = data.userIds
        const _room = new RoomModel({
            _id: roomId.toString(),
            createBy: data.userId._id,
            admins:IdArr?.length==2? IdArr:data.userId._id ,
            avatar: data?.roomAvatar,
            name : data?.roomName
        });
        try {
            await _room.save()
            return false
        } catch (error) {
            return "err"
        }
    }
    else{
        return "err"
    }

};

export default {
    create,
    getByPage,
    getOne, 
    update, 
    remove,
    checkExist
};
