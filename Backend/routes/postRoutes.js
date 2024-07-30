import express from 'express';
import { verifyToken } from '../middlewares/auth.js'
import { 
    createPost,
    getPosts
} from '../controllers/postController.js'

const router = express.Router();

router.post('/create-new-post', verifyToken, createPost);
router.get('/get-posts', getPosts);


export default router;