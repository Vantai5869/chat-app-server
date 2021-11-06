import express from 'express';
import userController from '../controllers/user';
import adminCheck from '../middleware/adminCheck';
import extractJWT from '../middleware/extractJWT';
import meCheck from './../middleware/meCheck';

const router = express.Router();

router.get('/auth/validate', extractJWT, userController.validateToken);
router.get('/:page/:limit',adminCheck, userController.getByPage);
router.get('/',adminCheck, userController.getAllUsers);
router.post('/', userController.register);
router.get('/:id',meCheck, userController.getUser);
router.put('/:id',meCheck, userController.updateUser);
router.delete('/:id',adminCheck, userController.deleteUser);
router.delete('/',adminCheck, userController.deleteAll);
router.post('/login', userController.login);

export = router;
