
import express from 'express'
import friendController from '../controllers/friendController'
const router = express.Router()


// Cập nhật friend
router.post('/cancel/:user_id/:friend_id', friendController.cancelFriend)

// add friend
router.post('/',  friendController.add)

// get all friend id
router.get('/:user_id',  friendController.getAll)

// Xóa friend
router.delete('/:id',  friendController.deleteFriend)

// Cập nhật friend
router.put('/', friendController.editFriend)





export = router;