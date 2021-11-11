import express from 'express';
import messageController from '../controllers/message';
import adminCheck from '../middleware/adminCheck';
import extractJWT from '../middleware/extractJWT';

const router = express.Router();

// get messages of room
router.get('/rooms/:roomId/:page/:limit', messageController.getMessagesByRoomId);

// get last messages by userId
router.get('/users/:userId/:page/:limit', messageController.getMessagesByUserId);
router.get('/:page/:limit', messageController.getByPage);
router.get('/:id', messageController.getOne);
router.post('/', messageController.create);
router.put('/:id', messageController.update);
router.delete('/:id', messageController.remove);

export = router;
