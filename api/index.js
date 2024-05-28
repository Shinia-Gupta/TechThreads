import express from 'express';
import { db } from './dbConnect.js';
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
db();
const app=express();
app.use(express.json());
app.use(cookieParser());

app.listen(3000,()=>{
    console.log("Server is listening at port 3000!!");
})

app.use('/api/user',userRoutes)
app.use('/api/auth',authRoutes)

app.use((err,req,res,next)=>{
    const statusCode=err.statusCode||500;
    const message=err.message||"Internal Server Error"
    res.status(statusCode).json({
        success:false,
        statusCode,
        message
    })
})