import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const db = () =>
  mongoose
    .connect(process.env.MONGO)
    .then(console.log("Connected to MongoDB"))
    .catch((err) => {
      console.error("Could not connect to MongoDB", err);
    });

// axzlq2jywdihGBav;
