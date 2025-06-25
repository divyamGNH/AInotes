import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import brcypt from "bcryptjs";
import axios from "axios";
import connectDB from "./db/db.js";

import auth from "./routes/auth.js";

connectDB();
dotenv.config();

const PORT = process.env.PORT;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("api/auth",auth);

app.listen(PORT,()=>{
    console.log(`Server listening on port: ${PORT}`);
})