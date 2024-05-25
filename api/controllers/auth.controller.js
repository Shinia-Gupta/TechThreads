import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/errorHandler.js";

export const signup=async(req,res,next)=>{
    const {username,email,password}=req.body;
    if(!username||!email||!password||username===''||email===''||password===''){
        next(errorHandler(400,'All fields are required ! '));
    }
const hashPass=bcryptjs.hashSync(password,10);
    const newUser=new User({username,email,password:hashPass});
    try {

    await newUser.save();
    res.json({message:'Signup successful'})
        
    } catch (error) {
next(error);
}
}