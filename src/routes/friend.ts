
import express from 'express'
import FriendController from '../controllers/FriendController'
const router = express.Router()



// add friend
router.post('/',  FriendController.add)

// get all friend id
router.get('/:user_id',  FriendController.getAll)

// Xóa friend
router.delete('/:id',  FriendController.deleteFriend)

// Cập nhật friend
router.put('/', FriendController.editFriend)

// Cập nhật friend
router.delete('/cancel/:user_id/:friend_id', FriendController.cancelFriend)



export = router;