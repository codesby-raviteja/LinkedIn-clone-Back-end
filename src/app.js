import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import authRouter from "./Routes/auth.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import profileRoute from "./Routes/profile.js";
import postsRouter from "./Routes/posts.js";
import { createServer } from "http";
import initializeSocket, { setSocket } from "./utils/socket.js";
import connectionsRouter from "./Routes/connectionsRoute.js";

dotenv.config();

const app = express(); // Creating an instance of the expresss

const httpServer = createServer(app);

const io = initializeSocket(httpServer);
setSocket(io);

let PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

console.log("RUNNING APP.js");

app.use("/", authRouter);

app.use("/", profileRoute);
app.use("/", postsRouter);
app.use("/", connectionsRouter);

connectDB()
  .then(() => {
    console.log("Database connection was successfull");
    httpServer.listen(PORT, () => {
      console.log(`server started listening at ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err.message);
    console.log("Database connection was not succesfull");
  });
