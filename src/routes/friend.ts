
import express from 'express'
import friendController from '../controllers/friendController'
const router = express.Router()


// Cập nhật friend
router.delete('/cancel/:user_id/:friend_id', friendController.cancelFriend)

// Cập nhật friend
router.put('/accept', friendController.editFriend)

router.delete('delete/:id',  friendController.deleteFriend)


// add friend
router.post('/',  friendController.add)

// get all friend id
router.get('/:user_id',  friendController.getAll)

// Xóa friend







export = router;