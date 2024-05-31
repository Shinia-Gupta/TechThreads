import express from 'express';
import { createComment } from '../controllers/comment.controller.js';
import { verifyToken } from '../middlewares/verifyUser.middleware.js';
const router = express.Router();


router.post('/create-comment',verifyToken,createComment);
// router.post('/signin',signin);
// router.post('/google',signinWithGoogle);

export default router;