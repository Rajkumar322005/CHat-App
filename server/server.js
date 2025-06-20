import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/UserRoutes.js";
import messageRouter from "./routes/MessageRoutes.js";
import {Server} from "socket.io";


// Initialize express app and http server
const app = express();
const server = http.createServer(app);


//Initialize Socket.io Server
export const io = new Server(server,{
    cors:{origin:"*"}
});
export const userSocketMap = {}; // {userId: socketId}
io.on("connection", (socket)=>{
    const userId = socket.handshake.query.userId;
    console.log("User Connected",userId);

    if(userId){
        userSocketMap[userId] = socket.id;
    }
    //Emit online users to all connected clients
    io.emit("getOnlineUsers",Object.keys(userSocketMap));
    socket.on("disconnect",()=>{
        console.log("User Disconnected",userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap))

    })
})


// Middleware setup
app.use(express.json({limit:"4mb"}))
app.use(cors());

// Routes setup
app.use("/api/status", (req,res) => res.send("Sever is running"))
app.use("/api/auth",userRouter);
app.use("/api/messages",messageRouter);
//connect to MongoDB
await connectDB();
const PORT = process.env.PORT || 5000;

server.listen(PORT,(req,res)=> console.log("Server Is Running on PORT: "+PORT));
