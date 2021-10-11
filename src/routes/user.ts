import express from 'express';
import controller from '../controllers/user';
import extractJWT from '../middleware/extractJWT';

const router = express.Router();

router.get('/auth/validate', extractJWT, controller.validateToken);
router.get('/', controller.getAllUsers);
router.post('/', controller.register);
router.get('/:id', ()=>{});
router.put('/:id', ()=>{});
router.delete('/:id', ()=>{});
router.delete('/', controller.deleteAll);
router.post('/login', controller.login);

export = router;
