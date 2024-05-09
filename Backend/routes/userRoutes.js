import express from "express";
import {login, signup, googleAuth, updateUser, verifyToken, logout, deleteUser}  from "../controllers/userController.js";

const router = express.Router();

router.post('/signup', signup)
router.post('/login', login)
router.post('/google', googleAuth)
router.post('/logout', logout)
router.put('/update/:userId', verifyToken, updateUser)
router.delete('/delete/:userId', verifyToken, deleteUser)

export default router
