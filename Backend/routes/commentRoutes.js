import express from 'express';
import { verifyToken } from '../middlewares/auth.js';
import { postComment } from '../controllers/commentController.js';

const router = express.Router()

router.post('/post-comment', verifyToken, postComment)

export default router;