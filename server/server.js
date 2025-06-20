import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/UserRoutes.js";
import messageRouter from "./routes/MessageRoutes.js";


// Initialize express app and http server
const app = express();
const server = http.createServer(app);

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
