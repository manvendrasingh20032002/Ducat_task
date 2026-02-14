import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"
import authRoutes from "./routes/authRoutes.js"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("DB Connected"))
.catch(err=>console.log(err))

app.get("/",(req,res)=>{
  res.send("API Running")
})

app.use("/auth", authRoutes) 

app.listen(5000,()=>console.log("Server running on port 5000"))