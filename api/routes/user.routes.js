import express from 'express';
import { test, updateUser,deleteUser,signOut, getUsers, getUserForComment } from '../controllers/user.controller.js';
import { verifyToken } from '../middlewares/verifyUser.middleware.js';

const router=express.Router();

router.put('/update/:userId',verifyToken,updateUser);
router.delete('/delete/:userId',verifyToken,deleteUser);
router.post('/signout',signOut);
router.get('/getusers',verifyToken,getUsers);
router.get('/:userId',getUserForComment);

export default router;