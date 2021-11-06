import express from 'express';
import userController from '../controllers/user';
import adminCheck from '../middleware/adminCheck';
import extractJWT from '../middleware/extractJWT';
import meCheck from './../middleware/meCheck';

const router = express.Router();

router.get('/auth/validate',extractJWT, userController.validateToken);
router.get('/:page/:limit', userController.getByPage);
router.get('/', userController.getAllUsers);
router.post('/', userController.register);
router.get('/:id', userController.getUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.delete('/', userController.deleteAll);
router.post('/login', userController.login);

export = router;
