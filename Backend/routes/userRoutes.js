import express from "express";
import {login, signup, googleAuth}  from "../controllers/userController.js";

const router = express.Router();

router.post('/signup', signup)
router.post('/login', login)
router.post('/google', googleAuth)

export default router