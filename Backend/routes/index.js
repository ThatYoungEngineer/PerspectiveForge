import express from 'express';
import userRoutes from "./userRoutes.js";
import postRoutes from "./postRoutes.js";

const router = express.Router();

router.use('/user', userRoutes);
router.use('/post', postRoutes);

export default router