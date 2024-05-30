import { errorHandler } from "../utils/errorHandler.js";
import User from "../models/user.model.js";
export const test = (req, res) => {
  res.status(200).json({ message: "Test Successful" });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this user!"));
  }

  try {
    const updateUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          password: req.body.password,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
        },
      },
      { new: true, runValidators: true }
    );

    const { password, ...rest } = updateUser._doc;
    res.status(200).json(rest);
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

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this user!"));
  }

  try {
    await User.findByIdAndDelete(req.params.userId);

    res.status(200).json("User has been deleted! ");
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

export const signOut = (req, res, next) => {
  try {
    res
      .clearCookie("accessToken")
      .status(200)
      .json("User has been signed out! ");
  } catch (error) {
    next(error);
  }
};

export const getUsers=async (req,res,next)=>{
  console.log(req.user);
  if(!req.user.isAdmin){
    return next(errorHandler(403,"You are not allowed to see all users! "));
}

  try {
    const startIndex=parseInt(req.query.startIndex)||0;
const limit=parseInt(req.query.limit)||9;
const sortDirection=req.query.sort==='asc'?1:-1;

const users=await User.find().sort({createdAt:sortDirection}).skip(startIndex).limit(limit).select('-password');
const totalUsers=await User.countDocuments();
const now=new Date();
const lastMonthDate=new Date(
  now.getFullYear(),
  now.getMonth()-1,
  now.getDate()
);
const lastMonthUsers=await User.countDocuments({createdAt:{$gte:lastMonthDate}})
res.status(200).json({users,totalUsers,lastMonthUsers});
  } catch (error) {
    next(error)
  }
}