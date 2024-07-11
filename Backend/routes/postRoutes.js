import express from 'express';
import { verifyToken } from '../middlewares/auth.js'
import { 
    createPost
} from '../controllers/postController.js'

const router = express.Router();

router.post('/create-new-post', verifyToken, createPost);


export default router;