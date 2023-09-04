import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoute from './routes/auth.js';
import usersRoute from './routes/users.js';
import hotelsRoute from './routes/hotels.js';
import roomsRoute from './routes/rooms.js';
import cookieParser from 'cookie-parser';

const app=express();
dotenv.config();

const connect=async()=>{
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("Connected to mongoDB.")
    } catch (error) {
        throw error;
    }
};

mongoose.connection.on("disconnected",()=>{
    console.log("mongoDB disconnected");
})

//middlewares
app.use(
    cors({
        origin: "https://bookingapp-frontend.onrender.com",
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    })
);

app.use(cookieParser());
app.use(express.json()); 

app.use("/server/auth", authRoute);
app.use("/server/users", usersRoute);
app.use("/server/hotels", hotelsRoute);
app.use("/server/rooms", roomsRoute);

app.use((err,req,res,next)=>{
    const errorStatus=err.status || 500;
    const errorMessage=err.message || "Something went wrong!";
    return res.status(errorStatus).json({
        success:false,
        status:errorStatus,
        message:errorMessage,
        stack:err.stack,
    });
})

const PORT=process.env.PORT || 8800;

app.listen(PORT,()=>{
    connect()
    console.log(`Connected to port ${PORT}`);
});