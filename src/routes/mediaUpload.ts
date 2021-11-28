import express from 'express';
import mediaUpload from '../controllers/mediaUpload';
import adminCheck from '../middleware/adminCheck';
import extractJWT from '../middleware/extractJWT';

const router = express.Router();

router.post('/upload', mediaUpload.uploadToCloudinary);
export = router;
