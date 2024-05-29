import express from 'express';
import { signin, signinWithGoogle, signup } from '../controllers/auth.controller.js';
import { verifyToken } from '../middlewares/verifyUser.middleware.js';
import { createPost } from '../controllers/post.controller.js';

const router = express.Router();


router.post('/create-post',verifyToken,createPost);
// router.post('/signin',signin);
// router.post('/google',signinWithGoogle);

export default router;