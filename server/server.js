import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";

const app = express();
const server = http.createServer(app);
app.use(express.json({limit:"4mb"}))

app.use(cors());
app.use("/api/status", (req,res) => res.send("Sever is running"))

//connect to MongoDB
await connectDB();
const PORT = process.env.PORT || 5000;

server.listen(PORT,(req,res)=> console.log("Server Is Running on PORT: "+PORT));
