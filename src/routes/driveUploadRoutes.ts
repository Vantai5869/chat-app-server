import express from 'express';
import driveUploadController from '../controllers/driveUpload';
import adminCheck from '../middleware/adminCheck';
import extractJWT from '../middleware/extractJWT';

const router = express.Router();

router.post('/upload', driveUploadController.uploadToServer);
export = router;
