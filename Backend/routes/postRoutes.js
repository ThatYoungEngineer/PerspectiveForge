import express from 'express';
import { verifyToken } from '../middlewares/auth.js'
import { 
    createPost,
    getPosts,
    deletePost
} from '../controllers/postController.js'

const router = express.Router();

router.post('/create-new-post', verifyToken, createPost);
router.get('/get-posts', getPosts);
router.delete('/delete/:postId', verifyToken, deletePost);


export default router;