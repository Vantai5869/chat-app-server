import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import logging from '../config/logging';
import {UserModel} from './../models/User';
import signJWT from '../functions/signJTW';

const NAMESPACE = 'User';

const validateToken = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Token validated, user authorized.');

    return res.status(200).json({
        message: 'Token(s) validated'
    });
};

const register = (req: Request, res: Response, next: NextFunction) => {
    let { email, password } = req.body;
    bcryptjs.hash(password, 10, (hashError, hash) => {
        if (hashError) {
            return res.status(401).json({
                message: hashError.message,
                error: hashError
            });
        }

        const _user = new UserModel({
            _id: new mongoose.Types.ObjectId(),
            email,
            password: hash
        });

        return _user
            .save()
            .then((user) => {
                return res.status(201).json({
                    user
                });
            })
            .catch((error) => {
                return res.status(500).json({
                    message: error.message,
                    error
                });
            });
    });
};

const login =async (req: Request, res: Response, next: NextFunction) => {
    let { email, password } = req.body;
    try {
        const users= await UserModel.find({ email })
        if(users){
            if (users.length !== 1) {
                return res.status(401).json({
                    message: 'Unauthorized'
                });
            }

            bcryptjs.compare(password, users[0].password, (error, result) => {
                if (error) {
                    return res.status(401).json({
                        message: 'Password Mismatch'
                    });
                } else if (result) {
                    signJWT(users[0], (_error, token) => {
                        if (_error) {
                            return res.status(500).json({
                                message: _error.message,
                                error: _error
                            });
                        } else if (token) {
                            return res.status(200).json({
                                message: 'Auth successful',
                                token: token,
                                user: users[0]
                            });
                        }
                    });
                }
            });
        }
    } catch (err) {
        console.log(err);
            res.status(500).json({
                error: err
            });
    }
};

const getAllUsers = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const users= await UserModel.find().select('-password')
        if(users){
            return res.status(200).json({
                users: users,
                count: users.length
            });
        }
        return res.status(400)
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            error
        });
    }
    
     
};

const deleteAll = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const usersDie= await UserModel.deleteMany({})
        if(usersDie)
        return res.status(200).json({
            message: `Deleted ${usersDie.deletedCount} !`,
        });
      
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            error
        });
    }
    
     
};

export default { validateToken, register, login, getAllUsers, deleteAll };
