import mongoose from 'mongoose';
import { FriendModel } from "../models/friends";

const getAll = async (req, res, next) => {
    let friends
     FriendModel.find({ userId: req.params.user_id }, (err, kq1) => {
        friends = kq1
        FriendModel.find({ friendId: req.params.user_id }, (err, kq2) => {
            req.friends = friends.push(kq2)
            next()
        }).distinct('userId')
    }).distinct('friendId')

}

const getAllFriend = async (req, res, next) => {
    try {
     FriendModel.find({ userId: req.params.user_id }, (err, friends) => {
        req.friends = friends
        next()
    }).where('accepted').equals(true).distinct('friendId')
    } catch (error) {
        console.log(error)
    }
   

}

const  getMyRequest = async (req, res, next) => {
    console.log(req.params.user_id)
     FriendModel.find({ userId: req.params.user_id }, (err, friendRequests) => {
        req.myRequests = friendRequests  
        next()
    }).where('accepted').equals(false).distinct('friendId')
}


const getAllRequest = async (req, res, next) => {
     FriendModel.find({ friendId: req.params.user_id }, (err, myRequests) => {
        req.friendRequests = myRequests  
        next()
    }).where('accepted').equals(false).distinct('userId')

}


const deleteFriend = async (req, res) => {
     FriendModel.findOneAndDelete({ _id: req.params.id }, function (err) {
        if (err) {
            res.json({ success: false });
        } else {
            res.json({ success: true });
        }
    })
}

const add = async (req, res) => {
    console.log('req.body')
    console.log(req.body)
    const data={ friendId: req.body.friend_id, userId: req.body.user_id };
    FriendModel.findOne(data,async (err, user) => {
        if (err) { return res.json({ success: false, message:err }) }
        if (user) {
            return res.json({ success: false })
        }
        else {
            const _friend = new FriendModel({
                _id:new mongoose.Types.ObjectId(),
                ...data
            })

            try {
                const friend= await  _friend.save()
                if(friend){
                    return res.status(201).json({
                        success:true,
                        message: 'Create success',
                        data: friend,
                    })
                }
                return res.status(404).json({
                    success:false,
                    message: 'create not successful',
                })
             
            } catch (error) {
                return res.status(500).json({
                    success:false,
                    message: error.message,
                })
            }

        }
    })

}

const editFriend = async (req, res) => {
    let options = { upsert: true, new: false, setDefaultsOnInsert: false };
    let kq
     FriendModel.findOneAndUpdate({ friendId: req.body.friend_id, userId: req.body.user_id },
        { $set: { accepted: true } }, options, (err, doc) => {
            if (err) {
                console.log("Something wrong when updating data!");
                kq= false
            }else{
                kq=true;
            }

        });
     FriendModel.findOneAndUpdate({ userId: req.body.friend_id, friendId: req.body.user_id },
        { $set: { accepted: true } }, options, (err, doc) => {
            if (err) {
                console.log("Something wrong when updating data!");
                kq= false
            }else{
                kq=true;
            }
        });
    if(kq){
        res.json({
            success: true
        })
    }else{
        res.json({
            success: false
        })
    }
}

const cancelFriend = async (req, res) => {
    let kq=true;
    FriendModel.findOneAndDelete({ friendId: req.params.friend_id, userId: req.params.user_id },
        (err, doc) => {
            if (err) {
                console.log("Something wrong when updating data!");
                kq= false
            }
        });
    FriendModel.findOneAndDelete({ userId: req.params.friend_id, friendId: req.params.user_id },
        (err, doc) => {
            if (err) {
                console.log("Something wrong when updating data!");
                kq= false
            }
        });

        if(kq){
            res.json({
                success: true
            })
        }else{
            res.json({
                success: false
            })
        }
}

export default {
    add,
    deleteFriend,
    getAll,
    getAllFriend,
    getAllRequest,
    editFriend,
    cancelFriend,
    getMyRequest
}