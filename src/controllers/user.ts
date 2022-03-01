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

const register =async (req: Request, res: Response) => {
    if(!req.body.phone || !req.body.username|| !req.body.password)return  res.status(400).json({
        success: false,
        message: 'phone|username|password field not found'
    });

    let { phone, password,...rest } = req.body;
    bcryptjs.hash(password, 10, (hashError, hash) => {
        if (hashError) {
            return res.status(401).json({
                message: hashError.message,
                error: hashError
            });
        }

        const _user = new UserModel({
            _id: new mongoose.Types.ObjectId(),
            ...rest,
            phone,
            password: hash
        });

        
        return _user
            .save()
            .then((user) => {
                signJWT(user, (_error, token) => {
                    if (_error) {
                        return res.status(500).json({
                            message: _error.message,
                            error: _error
                        });
                    } else if (token) {
                        return res.status(201).json({
                            success:true,
                            user,
                            token
                        });
                    } 
                })
            })
            .catch((error) => {
                console.log(error);
                return res.status(500).json({
                    message: error.message,
                    error
                });
            });
    });
};

const login =async (req: Request, res: Response) => {
    if(!req.body.email && !req.body.phone|| !req.body.password)return  res.status(400).json({
        success: false,
        message: 'email|phone|password field not found'
    });
    let { email,phone, password } = req.body;
    try {
        let users
        if(email) {
            users= await UserModel.find({ email })
            if (users.length !== 1) {
                users= await UserModel.find({ phone })
            }
        }else{
            users= await UserModel.find({ phone })
        }
        if(users){
            if (users?.length !== 1) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized'
                });
            }

            bcryptjs.compare(password, users[0].password, (error, result) => {
                if (error) {
                    return res.status(401).json({
                        success: false,
                        message: 'Password Mismatch'
                    });
                } else if (result) {
                    signJWT(users[0], (_error, token) => {
                        if (_error) {
                            return res.status(500).json({
                                success: false,
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
                                    avatar: users[0].avatar,
                                }
                            });
                        }
                    });
                }else{
                    return res.status(401).json({
                        success: false,
                        message: 'Password Mismatch'
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
        const user= await UserModel.findById(req.params.id).select('-password')
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
    if(req.body.password) {
        if(!req.body.newPassword){
            return res.status(401).json({
              success:false,
              error:'update password not successful!'
            });
        }
        const user= await UserModel.findOne({_id:req.params.id})
        bcryptjs.compare(req.body.password, user.password, (error, result) => {
            if (error) {
                return res.status(401).json({
                    success: false,
                    message: 'Password Mismatch'
                });
            } else if(result) {
                bcryptjs.hash(req.body.newPassword, 10, (hashError, hash) => {
                    if(!hashError) {
                        user.password=hash;
                        user.save()
                        return res.status(200).json({
                            success: true,
                            message: 'Cập nhật mật khẩu thành công!'
                        })
                    }
                    else{
                        return res.status(401).json({
                            message: hashError.message,
                            error: hashError
                        });
                    }
                })
            }else{
                return res.status(200).json({
                    success: false,
                    message: 'Mật khẩu không đúng!'
                })
            }
        })
        
    }else{
        try {
            const user= await UserModel.findByIdAndUpdate({_id: req.params.id},req.body)
            if(user){
                return res.status(200).json({
                    success: true,
                    message: `Updated  !`,
                    data:user
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

const verify = async(userId: string): Promise<boolean> => {
    try {
        const userUpdate= await UserModel.findByIdAndUpdate(userId,{verify:true})
        if(userUpdate)
        return true
        else{
            return false
        }
        
    } catch (error) {
        return false
    }

};


// friend

const getFriend = async (req, res) => {
    UserModel.find().select("-password").where('_id').in(req.friends).exec((err, records) => {
        res.json({ friends: records })
    })
}

const checkFriend = async (req, res) => {
    let check = req.friends.includes(req.params.check_user_id);
    if (check) {
        res.json(true)
    }
    else {
        res.json(false)
    }
}

const getFriendRequests = async (req, res) => {
    // console.log(req.friendRequests)
    UserModel.find().select("-password").where('_id').in(req.friendRequests).exec((err, records) => {
        res.json({ friends: records });
    });
}


const getMyRequests = async (req, res) => {
    // console.log(req.friendRequests)
    UserModel.find().select("-password").where('_id').in(req.myRequests).exec((err, records) => {
        res.json({ friends: records });
    });
}


const getRecommend = async (req, res) => {
    UserModel.find().sort({ _id: -1 }).select("-password").where('_id').nin(req.friends).limit(10).exec((err, records) => {
        res.json({ users: records });
    })
}
export default { 
    validateToken, 
    register, 
    login, 
    getAllUsers,
    deleteAll,
    getUser, 
    updateUser, 
    deleteUser,
    getByPage,
    verify,
    getFriend,
    checkFriend,
    getFriendRequests,
    getMyRequests,
    getRecommend

};
