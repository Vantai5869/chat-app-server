import { FriendModel } from "../models/friends"

const getAll = async (req, res, next) => {
     FriendModel.find({ userId: req.params.user_id }, (err, friends) => {
        req.friends = friends
        next()
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

const getAllRequest = async (req, res, next) => {
     FriendModel.find({ userId: req.params.user_id }, (err, friendRequests) => {
        req.friendRequests = friendRequests  
        next()
    }).where('accepted').equals(false).distinct('friendId')

}


const getMyRequest = async (req, res, next) => {
     FriendModel.find({ friendId: req.params.user_id }, (err, myRequests) => {
        req.myRequests = myRequests  
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
    FriendModel.findOne({ friendId: req.body.friend_id, user_id: req.body.user_id }, (err, user) => {
        if (user) {
            return res.json({ success: false })
        }
        else {
            const friend = new FriendModel(req.body)
            friend.save((err, result) => {
                if (err) { return res.json({ success: true }) }
                res.json({ success: true, data: result })
            })
        }
    })

}

const editFriend = async (req, res) => {
    let options = { upsert: true, new: false, setDefaultsOnInsert: false };
     FriendModel.findOneAndUpdate({ friendId: req.body.friend_id, user_id: req.body.user_id },
        { $set: { accepted: true } }, options, (err, doc) => {
            if (err) {
                console.log("Something wrong when updating data!");
            }
            res.json({ friend: doc })
            // console.log(doc)

        });
}

const cancelFriend = async (req, res) => {

    FriendModel.findOneAndDelete({ friendId: req.params.friend_id, user_id: req.params.user_id },
        (err, doc) => {
            if (err) {
                console.log("Something wrong when delete friend!");
            }
            res.json({
                success: true
            })
        });
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