import express from 'express';
import userController from '../controllers/user';
import friendController from '../controllers/friendController'
import adminCheck from '../middleware/adminCheck';
import extractJWT from '../middleware/extractJWT';
import meCheck from './../middleware/meCheck';

const router = express.Router();

router.get('/auth/validate',extractJWT, userController.validateToken);
router.get('/:page/:limit', userController.getByPage);
router.get('/', userController.getAllUsers);
router.post('/', userController.register);
router.get('/:id', userController.getUser);
router.put('/:id',meCheck, userController.updateUser);
router.delete('/:id',adminCheck, userController.deleteUser);
router.delete('/',adminCheck, userController.deleteAll);
router.post('/login', userController.login);

// friend


// get getRecommend
router.get('/recommend/:user_id',  friendController.getAll, userController.getRecommend)

// get friends
router.get('/friend/:user_id',  friendController.getAllFriend, userController.getFriend)

// check Friends
router.get('/friend/:user_id/:check_user_id',  friendController.getAllFriend, userController.checkFriend)

// get friend request
router.get('/friend-request/:user_id', friendController.getAllRequest, userController.getFriendRequests)

export = router;
