import {ApiError}  from '../utiles/apierr.js'
import {asynchandler} from '../utiles/asynchandler.js'
import jwt from 'jsonwebtoken'
import {User } from '../models/user.model.js'


export const verfyjwt=asynchandler(async( req, _ ,next)=>{
  try {
   const token=req.cookies?.accesstoken|| req.header
     ('Authorization')?.replace("Bearer","")
     console.log(token)
 if(!token){
  throw new ApiError(401,"unauthorized token")
 }  
   const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRATE)
   
  const user= await User.findById(decodedToken?._id).select("-Password -RefreshToken")
  if(!user){
   throw new ApiError(401,'invalide access Token')
  }
  req.user=user
  next()
  } catch (error) {
   throw new ApiError(401,'invalide access token')
  }
})