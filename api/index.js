import express from 'express';
import { db } from './dbConnect.js';
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js';
db();
const app=express();
app.use(express.json());

app.listen(3000,()=>{
    console.log("Server is listening at port 3000!!");
})

app.use('/api/user',userRoutes)
app.use('/api/auth',authRoutes)