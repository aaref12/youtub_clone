import { asynchandler } from '../utiles/asynchandler.js';
import {ApiError} from '../utiles/apierr.js';
import { User } from '../models/user.model.js';
import {uplodeOnCloudnary} from '../utiles/cloundanary.js';
import {ApiResponse} from '../utiles/ApiResponse.js'


const  userragister=(async (req,res)=>{
 
       //get user details from frontend
       //vallidation -not empty
       //check if user already exists username ,email
       // check for avatar and images
       //uplaode them to cloundnary
       //create usr object- creat entry in db
       //rome pass word and refresh tken field from response
       //check for user creation


       const {userName,Email,FullName,Password}=req.body
       console.log(FullName)
       if ([FullName,userName,Email,Password].some((field)=>
        field?.trim()==="")
       ){
        throw new ApiError(400,"all fields are required")
       }
   

       const existeduser=User.findOne({
        $or:[{userName},{Email}]
       })
      //  if(existeduser){
      //    throw new ApiError(409,"user is already exists")
      //  }
      const avatarLocalpath= req.files?.avatar[0]?.path
      const coverImageLocalpath= req.files?.coverImage[0]?.path
      if(!avatarLocalpath){
        throw new ApiError(400,"avatar is required")
      }
      
      const avatar=await uplodeOnCloudnary(avatarLocalpath)
      const coverImage=await uplodeOnCloudnary(coverImageLocalpath)

      if(!avatar){
        throw new ApiError(400,"avatar is required")
      }

      const user1= await User.create({
        FullName,
        Avatar:avatar.url,
        coverImage:coverImage?.url || "",
        Email,
        Password,
        userName
      }
    )
    console.log(user1)
    const createdUser= await User.findById(user1._id)
    .select(
      "-Password -RefreshToken"
    )
    if(!createdUser){
      throw new ApiError(500,"somthing went wrong")
    }
    return res.status(200).json(
    new ApiResponse(200,createdUser,"user ragistred succesffully")
    )
})

export default userragister 