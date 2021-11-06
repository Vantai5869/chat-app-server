import { NextFunction, Request, Response } from 'express';
import { RoomModel } from '../models/room';
import mongoose  from 'mongoose';

const create = async (req: Request, res: Response, next: NextFunction)=> {
    const _room = new RoomModel({
        _id: new mongoose.Types.ObjectId(),
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


export default {create, getByPage,getOne, update, remove };
