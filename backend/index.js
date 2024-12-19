import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './database/db.js';

import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

import {app, server,} from "./socket/socket.js"

import cloudinary from "cloudinary";
import cookieParser from 'cookie-parser';

import path from "path";


dotenv.config();

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
}
);


// middleware
app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT; 

//using routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/messages', messageRoutes);


const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    connectDB(); 
});