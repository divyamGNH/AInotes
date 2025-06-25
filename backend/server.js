import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./db/db.js";

import auth from "./routes/auth.js";
import verifyRoute from "./middlewares/verification.js";

connectDB();
dotenv.config();

const PORT = process.env.PORT;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth",auth);

app.listen(PORT,()=>{
    console.log(`Server listening on port: ${PORT}`);
})