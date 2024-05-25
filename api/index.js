import express from 'express';
import { db } from './dbConnect.js';

db();
const app=express();

app.listen(3000,()=>{
    console.log("Server is listening at port 3000!!");
})