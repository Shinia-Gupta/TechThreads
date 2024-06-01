import express from 'express';
import { createComment, getComments } from '../controllers/comment.controller.js';
import { verifyToken } from '../middlewares/verifyUser.middleware.js';
const router = express.Router();


router.post('/create-comment',verifyToken,createComment);
router.get('/get-comments/:postId',getComments);
// router.post('/google',signinWithGoogle);

export default router;