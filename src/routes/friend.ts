
import express from 'express'
import friendController from '../controllers/friendController'
const router = express.Router()



// add friend
router.post('/',  friendController.add)

// get all friend id
router.get('/:user_id',  friendController.getAll)

// Xóa friend
router.delete('/:id',  friendController.deleteFriend)

// Cập nhật friend
router.put('/', friendController.editFriend)

// Cập nhật friend
router.delete('/cancel/:user_id/:friend_id', friendController.cancelFriend)



export = router;