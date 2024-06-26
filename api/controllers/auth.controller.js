import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/errorHandler.js";
import jwt from 'jsonwebtoken';
import { userReducer } from "../../client/src/redux/reducers/userReducer.js";

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

export const signin=async(req,res,next)=>{
    const {email,password}=req.body;
if(!email||!password||email===''||password===''){
    next(errorHandler(400,'All fields are required! '))
}

try {
    const validUser=await User.findOne({email});
    if(!validUser){
       return next(errorHandler(404,'User not found'));
    }
    const validPassword=bcryptjs.compareSync(password,validUser.password);
    if(!validPassword){
      return next(errorHandler(400,'Invalid Password'));
    }
const token=jwt.sign(
    {id:validUser._id,isAdmin:validUser.isAdmin},process.env.JWT_SECRET,{expiresIn:'1d'}
)
const {password:pass,...rest}=validUser._doc;
res.status(200).cookie('accessToken',token,{
    httpOnly:true
}).json(rest)
} catch (error) {
    next(error)
}
}

export const signinWithGoogle=async (req,res,next)=>{
    const {name,email,googlePhotoUrl}=req.body;
    try {
    const existingUser=await User.findOne({email});
    if(existingUser){
        const token=jwt.sign({id:existingUser._id,isAdmin:existingUser.isAdmin},process.env.JWT_SECRET);
        const {password,...rest}=existingUser._doc;
        res.status(200).cookie('accessToken',token,{
            httpOnly:true
        }).json(rest);
    }else{
        const generatePass=Math.random().toString(36).slice(-8);
        const hashPass=bcryptjs.hashSync(generatePass,10);
        const newUser=new User({
            username:name.toLowerCase().split(' ').join('')+Math.random().toString(9).slice(-4),
            email:email,
            password:hashPass,
            profilePicture:googlePhotoUrl
        })
        await newUser.save();
        const token=jwt.sign({id:newUser._id,isAdmin:newUser.isAdmin},process.env.JWT_SECRET);
        const {password,...rest}=newUser._doc;
        res.status(200).cookie('accessToken',token,{
            httpOnly:true
        }).json(rest);
    }

} catch (error) {
    next(error)
}
}