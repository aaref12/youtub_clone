import { Router } from "express";
import {upload} from '../middlewares/multer.middleware.js'
import {publishAVideo}   from  '../controlers/video.controlers.js'







const routes=Router()

routes.route('/videouplode').post(
 upload.fields([{
   name:"videoFile",
   maxCount:1
 },
   {
    name:'Thumbnail',
    maxCount:1
  }
 ]),
 publishAVideo
)

export default routes