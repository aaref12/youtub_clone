import { Router } from "express";
import userragister from "../controlers/user.controlers.js";



const routes=Router()

routes.route('/ragister').post(userragister)


export default routes