import { Router } from "express";
import {upload} from '../middlewares/multer.middleware.js'
import {publishAVideo,getVideoById,updateVideo,deleteVideo,togglePublishStatus}   from  '../controlers/video.controlers.js'







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

routes.route('/videoId').post(getVideoById)
routes.route('/updateVideo').post(updateVideo)
routes.route('/deleteVideo').post(deleteVideo)
routes.route('/publishedvideo').post(togglePublishStatus)

export default routes