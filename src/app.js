import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/database.js"
import authRouter from "./Routes/auth.js"
import cors from "cors"
import cookieParser from "cookie-parser"
import profileRoute from "./Routes/profile.js"
import postsRouter from "./Routes/posts.js"
dotenv.config()

const app = express() // Creating an instance of the expresss

let PORT = process.env.PORT || 5000

app.use(express.json())
app.use(cookieParser())

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
)

app.use("/", authRouter)

app.use("/", profileRoute)
app.use("/",postsRouter)

connectDB()
  .then(() => {
    console.log("Database connection was successfull")
    app.listen(PORT, () => {
      console.log(`server started listening at ${PORT}`)
    })
  })
  .catch((err) => {
    console.log(err.message)
    console.log("Database connection was not succesfull")
  })
