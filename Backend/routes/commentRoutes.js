import express from 'express';
import { verifyToken } from '../middlewares/auth.js';
import { 
    postComment,
    getPostComments
} from '../controllers/commentController.js';

const router = express.Router()

router.post('/post-comment', verifyToken, postComment)
router.get('/getPostComments/:postId', getPostComments)

export default router;