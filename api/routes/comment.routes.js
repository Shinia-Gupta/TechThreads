import express from 'express';
import { createComment, deleteComment, editComment, getAllComments, getComments, likeComment } from '../controllers/comment.controller.js';
import { verifyToken } from '../middlewares/verifyUser.middleware.js';
const router = express.Router();


router.post('/create-comment',verifyToken,createComment);
router.get('/get-comments/:postId',getComments);
router.get('/get-comments',verifyToken,getAllComments);
router.put('/likeComment/:commentId',verifyToken,likeComment);
router.put('/editComment/:commentId',verifyToken,editComment);
router.delete('/deleteComment/:commentId',verifyToken,deleteComment);

export default router;