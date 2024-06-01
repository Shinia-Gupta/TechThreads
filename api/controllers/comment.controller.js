import Comment from "../models/comment.model.js";
import { errorHandler } from "../utils/errorHandler.js";


export const createComment=async(req,res,next)=>{
        
      try {
        const {content,postId,userId}=req.body;
        console.log(req.cookies.accessToken,req.user);
        if(userId!==req.user.id){
            return next(errorHandler(403,'You are not authorized to comment on this post!'))

        }
        const newComment = new Comment({
          content,userId,postId
        });
        await newComment.save();
        res.status(201).json(newComment);
      } catch (error) {
        if (error.name === "ValidationError") {
          return next(
            errorHandler(
              400,
              Object.values(error.errors)
                .map((e) => e.message)
                .join(", ")
            )
          );
        }
        next(error);
      }
}

export const getComments=async(req,res,next)=>{
const {postId}=req.params;
try {

  const comments=await Comment.find({postId}).sort({
    createdAt:-1
  });
  res.status(200).json(comments) 
} catch (error) {
  next(error)
}
}