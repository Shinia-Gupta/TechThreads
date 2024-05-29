import { ObjectId } from "mongodb";
import Post from "../models/post.model.js";
import { errorHandler } from "../utils/errorHandler.js"

export const createPost=async (req,res,next)=>{
    if(!req.user.isAdmin){
        return next(errorHandler(403,"You are not allowed to create a post! "));
    }
// if(!req.body.title||!req.body.content){
//     return next(errorHandler(400,"Please provide all required fields"))
// }
try{
const slug=req.body.title.split(' ').join('-').replace(/[^a-zA-Z0-9-]/g,'-');
const newPost=new Post({
    ...req.body,
    slug,
    userId:req.user.id
    
})
console.log(newPost);
await newPost.save();
res.status(201).json(newPost);
}catch(error){
    if (error.name === 'ValidationError') {
        return next(errorHandler(400, Object.values(error.errors).map(e => e.message).join(', ')));
      }
      console.log('error outside validator',error);
      next(error);
}
}