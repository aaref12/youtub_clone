import dotenv from "dotenv"
import connectDB from "./db/index.js"
import { app } from "./app.js"




dotenv.config({
 path:'./.env'
})

connectDB()
.then(()=>{
 app.listen(process.env.PORT || 8000,()=>{
    console.log(`server is connected to database and server is runnnig on ${process.env.PORT}`)
 })
 app.on("errr",(err)=>{
  console.log(`errr is ${err}`)
  throw err
 })
})
.catch((err)=>{
  console.log(`database connection is lost ${err}`)
})