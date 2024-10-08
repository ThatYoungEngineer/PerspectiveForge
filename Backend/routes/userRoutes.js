import express from "express";
import { verifyToken } from "../middlewares/auth.js"
import {
    login,
    signup,
    googleAuth,
    updateUser,
    logout,
    deleteUser,
    checkUserAuth,
    getUsersData,
    checkUsername,
    getUserById
}  from "../controllers/userController.js"

const router = express.Router();

router.post('/signup', signup)
router.post('/login', login)
router.post('/google', googleAuth)
router.post('/logout', logout)
router.put('/update/:userId', verifyToken, updateUser)
router.delete('/delete/:userId', verifyToken, deleteUser)
router.get('/checkUserAuth', checkUserAuth)
router.get('/getUsersData', verifyToken, getUsersData)
router.get('/getUserById/:userId', getUserById)
router.get('/checkUsername/:username', verifyToken, checkUsername)

export default router
