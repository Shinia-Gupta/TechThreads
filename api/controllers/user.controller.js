import { errorHandler } from "../utils/errorHandler.js"
import User from '../models/user.model.js'
export const test=(req,res)=>{
    res.status(200).json({message:"Test Successful"})
}

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.userId) {
      return next(errorHandler(403, "You are not allowed to update this user!"));
    }
  
    try {
      const updateUser = await User.findByIdAndUpdate(req.params.userId, {
        $set: {
          username: req.body.username,
          password: req.body.password,
          email: req.body.email,
          profilePicture: req.body.profilePicture
        },
      }, { new: true, runValidators: true });
  
      const { password, ...rest } = updateUser._doc;
      res.status(200).json(rest);
    } catch (error) {
      if (error.name === 'ValidationError') {
        return next(errorHandler(400, Object.values(error.errors).map(e => e.message).join(', ')));
      }
      next(error);
    }
  }


  export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.userId) {
      return next(errorHandler(403, "You are not allowed to delete this user!"));
    }
  
    try {
  await User.findByIdAndDelete(req.params.userId);
  
      res.status(200).json("User has been deleted! ");
    } catch (error) {
      if (error.name === 'ValidationError') {
        return next(errorHandler(400, Object.values(error.errors).map(e => e.message).join(', ')));
      }
      next(error);
    }
  }

  export const signOut=(req,res,next)=>{
try {
  res.clearCookie('accessToken').status(200).json('User has been signed out! ')
} catch (error) {
next(error)  
}
  }