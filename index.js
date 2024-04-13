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

const allowedOrigins = ['https://chipper-cajeta-929ae4.netlify.app/', 'https://another-allowed-origin.com'];

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
app.use(cookieParser());
app.use(express.json()); 
app.use(express.urlencoded({extended:false}));

app.use(cors({
  origin: function(origin, callback) {
    // Check if the origin is allowed
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(cors({
  origin: function(origin, callback) {
    // Check if the origin is allowed
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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
