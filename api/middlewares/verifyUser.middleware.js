import jwt from 'jsonwebtoken';
import { errorHandler } from '../utils/errorHandler.js'


export const verifyToken=(req,res,next)=>{
    const token=req.cookies.accessToken;
    if(!token){
        return next(errorHandler(401,'Unauthorized'));
    }
    jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
        if(err){
            return next(errorHandler(401,'Unauthorized'))
        }
        req.user=user;
        next();
    })
}