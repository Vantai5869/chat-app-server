import { NextFunction, Request, Response } from 'express';
import { MessageModel } from '../models/message';
import mongoose  from 'mongoose';

const create = async (req: Request, res: Response, next: NextFunction)=> {
    const _message = new MessageModel({
        _id: new mongoose.Types.ObjectId(),
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


export default {create, getByPage,getOne, update, remove };
