import express from "express"
import dotenv from "dotenv"
import cookieParser  from "cookie-parser"
import  {connectDb}  from "./config/connectDB.js"
import authRouter from "./routes/auth.routes.js"
import cors from "cors"

dotenv.config()

const port = process.env.PORT || 5000
const app = express()

app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

app.use("/api",authRouter)

app.get("/",(req,res) =>{
    res.send("Server is running")
})

app.listen(port , () =>{
    connectDb()
    console.log(`server is running on port ${port}`)
})