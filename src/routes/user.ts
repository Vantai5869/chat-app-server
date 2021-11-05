import express from 'express';
import controller from '../controllers/user';
import adminCheck from '../middleware/adminCheck';
import extractJWT from '../middleware/extractJWT';

const router = express.Router();

router.get('/auth/validate', extractJWT, controller.validateToken);
router.get('/', controller.getAllUsers);
router.post('/', controller.register);
router.get('/:id', controller.getUser);
router.put('/:id', controller.updateUser);
router.delete('/:id',extractJWT, controller.deleteUser);
router.delete('/',adminCheck, controller.deleteAll);
router.post('/login', controller.login);

export = router;
