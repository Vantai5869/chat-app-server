import express from 'express';
import participantController from '../controllers/participant';
import adminCheck from '../middleware/adminCheck';
import extractJWT from '../middleware/extractJWT';

const router = express.Router();

// lay 1 mang roomid cua người dùng theo trang
router.get('/:userId/:page/:limit', participantController.getRoomIdsByPage);
router.get('/:page/:limit', participantController.getByPage);
router.get('/:id', participantController.getOne);
router.post('/', participantController.create);
router.put('/:id', participantController.update);
router.delete('/:id', participantController.remove);



export = router;
