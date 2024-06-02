import Comment from "../models/comment.model.js";
import { errorHandler } from "../utils/errorHandler.js";

export const createComment = async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body;
    if (userId !== req.user.id) {
      return next(
        errorHandler(403, "You are not authorized to comment on this post!")
      );
    }
    const newComment = new Comment({
      content,
      userId,
      postId,
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
};

export const getComments = async (req, res, next) => {
  const { postId } = req.params;
  try {
    const comments = await Comment.find({ postId }).sort({
      createdAt: -1,
    });
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "Comment Not Found !"));
    }

    const userIndex = comment.likes.indexOf(req.user.id);
    if (userIndex === -1) {
      comment.likes.push(req.user.id);
      comment.numberOfLikes += 1;
    } else {
      comment.likes.splice(userIndex, 1);
      comment.numberOfLikes -= 1;
    }

    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

export const editComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return next(errorHandler(404, "Comment Not Found !"));
    }

    if (comment.userId === req.user.id || req.user.isAdmin) {
      const editedComment = await Comment.findByIdAndUpdate(
        req.params.commentId,
        {
          content: content,
        },
        { new: true }
      );
      res.status(200).json(editedComment);
    } else {
      return next(
        errorHandler(400, "You are not authorized to edit this comment !")
      );
    }
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return next(errorHandler(404, "Comment Not Found !"));
    }

    if (comment.userId === req.user.id || req.user.isAdmin) {
      await Comment.findByIdAndDelete(req.params.commentId);
      res.status(200).json("The comment has been deleted !");
    } else {
      return next(
        errorHandler(400, "You are not authorized to delete this comment !")
      );
    }
  } catch (error) {
    next(error);
  }
};

export const getAllComments = async (req, res, next) => {
  if(!req.user.isAdmin){
    return next(errorHandler(403,"You are not allowed to see all comments! "));
}

  try {
    const startIndex=parseInt(req.query.startIndex)||0;
const limit=parseInt(req.query.limit)||9;
const sortDirection=req.query.sort==='asc'?1:-1;

const comments=await Comment.find().sort({createdAt:sortDirection}).skip(startIndex).limit(limit);
const totalComments=await Comment.countDocuments();
const now=new Date();
const lastMonthDate=new Date(
  now.getFullYear(),
  now.getMonth()-1,
  now.getDate()
);
const lastMonthComments=await Comment.countDocuments({createdAt:{$gte:lastMonthDate}})
res.status(200).json({comments,totalComments,lastMonthComments});
  } catch (error) {
    next(error)
  }
};