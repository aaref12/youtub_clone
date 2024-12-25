import { Router } from "express";
import userragister from "../controlers/user.controlers.js";
import { uplode } from "../middlewares/multer.middleware.js";


const routes=Router()

routes.route('/ragister').post(
 uplode.fields([
  {
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


export default routes