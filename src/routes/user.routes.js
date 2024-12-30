import { Router } from "express";
import {userragister, LoginUser, logoutUser } from "../controlers/user.controlers.js";
import {upload} from '../middlewares/multer.middleware.js'
import { verfyjwt } from "../middlewares/auth.middleware.js";


const routes=Router()

routes.route('/ragister').post(
 upload.fields([{
   name:"avatar",
   maxCount:1
 },
   {
    name:'coverImage',
    maxCount:1
  }
 ]),
 userragister
)

routes.route('/login').post(LoginUser)


//secure routes
routes.route('/logout').post(verfyjwt, logoutUser)


export default routes