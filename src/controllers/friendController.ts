import { FriendModel } from "../models/friends"

const getAll = async (req, res, next) => {
    await FriendModel.find({ user_id: req.params.user_id }, (err, friends) => {
        req.friends = friends
        next()
    }).distinct('friend_id')

}

const getAllFriend = async (req, res, next) => {
    await FriendModel.find({ user_id: req.params.user_id }, (err, friends) => {
        req.friends = friends
        next()
    }).where('accepted').equals(true).distinct('friend_id')

}


const getAllRequest = async (req, res, next) => {
    await FriendModel.find({ user_id: req.params.user_id }, (err, friendRequests) => {
        req.friendRequests = friendRequests  
        next()
    }).where('accepted').equals(false).distinct('friend_id')

}


const deleteFriend = async (req, res) => {
    await FriendModel.findOneAndDelete({ _id: req.params.id }, function (err) {
        if (err) {
            res.json({ success: false });
        } else {
            res.json({ success: true });
        }
    })
}

const add = async (req, res) => {
    FriendModel.findOne({ friend_id: req.body.friend_id, user_id: req.body.user_id }, (err, user) => {
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
    await FriendModel.findOneAndUpdate({ friend_id: req.body.friend_id, user_id: req.body.user_id },
        { $set: { accepted: true } }, options, (err, doc) => {
            if (err) {
                console.log("Something wrong when updating data!");
            }
            res.json({ friend: doc })
            // console.log(doc)

        });
}

const cancelFriend = async (req, res) => {

    FriendModel.findOneAndDelete({ friend_id: req.params.friend_id, user_id: req.params.user_id },
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
    cancelFriend
}