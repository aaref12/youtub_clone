import express from "express";
import cors from "cors";
import cookieParser from "cookies-parser";

const app=express()

app.use(cors(
 {
  origin:process.env.CORS_ORIGIN,
  credentials:true
 }
))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true ,limit:'16kb'}))
app.use(express.static("public"))







//Routes import
import userRoute from './routes/user.routes.js'
import videoRoute    from  './routes/video.routes.js'

app.use('/api/v1/users',userRoute)
app.use('/api/v1/videos',videoRoute)
//export default app

export {app}