import bcryptjs from 'bcryptjs';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import logging from '../config/logging';
import signJWT from '../functions/signJTW';
import { UserModel } from '../models/user';

const NAMESPACE = 'User';

const validateToken = (req: Request, res: Response) => {
    logging.info(NAMESPACE, 'Token validated, user authorized.');

    return res.status(200).json({
        success: true,
        message: 'Token(s) validated'
    });
};

const register = (req: Request, res: Response) => {
    let { email, password,...rest } = req.body;
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
            ...rest,
            password: hash
        });

        return _user
            .save()
            .then((user) => {
                return res.status(201).json({
                    success:true,
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

const login =async (req: Request, res: Response) => {
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
                                success: true,
                                message: 'Auth successful',
                                token: token,
                                user: {
                                    _id: users[0]._id,
                                    email:users[0].email,
                                    username: users[0].username,
                                    firstName: users[0].firstName,
                                    lastName: users[0].lastName,
                                }
                            });
                        }
                    });
                }
            });
        }
    } catch (err) {
        console.log(err);
            res.status(500).json({
                success: false,
                error: err
            });
    }
};

const getAllUsers = async(req: Request, res: Response) => {
    try {
        const users= await UserModel.find().select('-password')
        if(users){
            return res.status(200).json({
                success: true,
                users: users,
                count: users.length
            });
        }
        return res.status(400)
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            error
        });
    }
    
     
};

const deleteAll = async(req: Request, res: Response) => {
    try {
        const usersDie= await UserModel.deleteMany({})
        if(usersDie)
        return res.status(200).json({
            success: true,
            message: `Deleted ${usersDie.deletedCount} !`,
        });
      
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            error
        });
    }

};
const getUser = async(req: Request, res: Response) => {
    try {
        const user= await UserModel.findById(req.params.id)
        if(user)
        return res.status(200).json(
            {
                success:true,  
                data: user
            }
        );
      
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            error
        });
    }

};
const updateUser = async(req: Request, res: Response) => {
    try {
        const user= await UserModel.findByIdAndUpdate({_id: req.params.id},req.body)
        if(user){
            return res.status(200).json({
                success: true,
                message: `Updated ${user.email} !`,
            });

        }
        return res.status(200).json({
            message: `Cannot find!`,
        });
      
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            error
        });
    }

};
const deleteUser = async(req: Request, res: Response) => {
    try {
        const userDie= await UserModel.findByIdAndDelete(req.params.id)
        if(userDie)
        return res.status(200).json({
            success: true,
            message: `Deleted ${userDie.email} !`,
        });
      
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: error.message,
            error
        });
    }

};

const getByPage = async(req: Request, res: Response) => {
    let searchOption={}
    if(req.query.search && req.query.search!=''){
        let y:any=req.query.search
        let x=y.slice(0,1)[0]
        if(x==0||x==8){
            searchOption ={ 
                phone: { $regex: req.query.search, $options:"i"}
            }
        }
        else{
            searchOption ={ 
                username: { $regex: req.query.search, $options: "i" },
            }
        }
    }
    
     
    const pageOptions = {
        page: +req.params.page || 0,
        limit: +req.params.limit || 10
    }
    
    try {
        const users= await UserModel.find(
            searchOption,
            null,
            {
                sort:{_id:-1},
                skip:pageOptions?.page * pageOptions?.limit,
                limit:pageOptions?.limit
            }).select('-password')
        if(!users){
            return res.status(500);
        }
        return  res.status(200).json({
                success:true,
                message: `get success`,
                data: users,
            })
      
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: 'get user not successful',
            error:error
        })
           
    }

};



export default { validateToken, register, login, getAllUsers, deleteAll,getUser, updateUser, deleteUser,getByPage };
