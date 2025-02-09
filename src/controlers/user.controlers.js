import { asynchandler } from '../utiles/asynchandler.js';
import {ApiError} from '../utiles/apierr.js';
import {User} from '../models/user.model.js';

import {uplodeOnCloudnary} from '../utiles/cloundanary.js';
import {ApiResponse} from '../utiles/ApiResponse.js'
    


const  GentrateRefereshAndAcessToken= async  (user_id)=> {
  try {
       const user= await User.findById(user_id)
      const accesstoken=user.genrateAccessToken()
      const Refreshtoken=user.genratRefreshToken()
      user.Refreshtoken=Refreshtoken
     await user.save({validateBeforeSave:false})

     return {accesstoken,Refreshtoken}

  } catch (error) {
    throw new ApiError(500,"wait refreshtoken is genrate")
  }
}





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
        // if(existeduser){
        //   throw new ApiError(409,"user is already exists")
        // }
      const avatarLocalpath= req.files?.avatar[0]?.path
      const coverImageLocalpath= req.files?.coverImage?.path
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


// login user

const LoginUser=asynchandler(async(req,res)=>{
        //req.body==access.vlaue
        // username or email
        //find the user
        // password check
        //genrate refresh token and access token
        //send cookie
const {userName,Email,Password}=req.body
        console.log(userName)
        console.log(Password)
       if (!userName  && !Email){
              throw new ApiError(400,"userName not found please correct userName and Email")
          }
         
        const user= await User.findOne({
            $or: [{userName},{Email}]
         
             
            })
          if(!user){
            throw new ApiError(404,"user is not exist")
          }
          const isPasswordvalid= await user.isPasswordIscorrect(Password)
          console.log(isPasswordvalid)
          if(!isPasswordvalid){
          throw new ApiError(401,"password incorect")

          }
      const {accesstoken,Refreshtoken}= await GentrateRefereshAndAcessToken(user._id)
    const LogedInUser= await User.findById(User._id).select("-Password -RefreshToken")

    const options={
      httpOnly:true,
      secure:true
    }
    return res
    .status(200)
    .cookie("accesstoken",accesstoken,options)
    .cookie("Refreshtoken",Refreshtoken,options)
    .json(
      new ApiResponse(
        {
          user:LogedInUser,accesstoken,Refreshtoken,

        },
        "UserLogedIn successfully"
      )
    )

})
// logout
const logoutUser= asynchandler ( async(req,res)=>{
 await User.findByIdAndUpdate(
    req.user._id,
    {
      $set:{
        RefreshToken:undefined
      }
    },
    {
      new:true
    }
      
 )

 const options={
  httpOnly:true,
  secure:true
}

return res
    .status(200)
    .cookie("accesstoken",accesstoken,options)
    .cookie("Refreshtoken",Refreshtoken,options)
    .json(
      new ApiResponse(
        {
          

        },
        "UserLogout successfully"
      )
    ) 

})

const changeCurrentUser=asynchandler(async(req,res)=>{
  const {oldPassword,newPassword}=req.body
  const user=await User.findById(req.user?._id)
 const ispasswordcurrect =await user.isPasswordIscorrect(oldPassword)
 if(!ispasswordcurrect){
  throw new ApiError(400,"invalide old password")
 }
 user.Password=newPassword
  await user.seve({validateBeforeSave:false})
  return res
  .status(200)
  .json(new ApiResponse(200,{},"password change succesfully"))
})

const getcurrentUser=asynchandler(async(req,res)=>{
  return res
  .status(200)
  .json(200,req.user,'current user fatchs uccessfully')
})

const updateAccountDetails=asynchandler(async(req,res)=>{
  const {FullName,Email}=req.body
  if(!FullName || !Email){
    throw new ApiError(400,'all feilds are required')
  }
 const user= User.findByIdAndUpdate(
    req.user?._id,
    {
     $set:{FullName,Email}
    },
    {
      new:true
    }
  ).select("-Password")
  return res
  .status(200)
  .json(new ApiResponse(200,"Account Details Updated successfully"))
})

const updateUserAvatar=asynchandler(async(req,res)=>{
 const avatarLocalpath= req.file?.path
 if(!avatarLocalpath){
  throw new ApiError(400,"Avatar file is missing")
 }
 const avatar=await uplodeOnCloudnary(avatarLocalpath)
 if(!avatar.url){
  throw new ApiError(400,"Avatar file is missing")
 }
 await user.findByIdAndUpdate(
  req.user?._id,
  {
    $set:{
      Avatar:avatar.url
    }
  },{
    new:true
  }
).select('-Password')
return res
 .status(200)
 .json(new ApiResponse(200,user,'Avatar successfuuly'))
 })
 


const updateUserCoverImage=asynchandler(async(req,res)=>{
  const CoverImageLocalpath= req.file?.path
  if(!CoverImageLocalpath){
   throw new ApiError(400,"CoverImage file is missing")
  }
  const coverImage=await uplodeOnCloudnary(CoverImageLocalpath)
  if(!coverImage.url){
   throw new ApiError(400,"CoverImage file is missing")
  }
      const user=await user.findByIdAndUpdate(
   req.user?._id,
   {
     $set:{
      CoverImage:CoverImage.url
     }
   },{
     new:true
   }
 ).select('-Password')
 return res
 .status(200)
 .json(new ApiResponse(200,user,'coverImages successfuuly'))
 })

 const getUserChannelprofile=asynchandler(async(req,res)=>{
  const {userName}=req.params
  if(!userName?.trim()){
    throw new ApiError(400,'userName is missing')
  }
  const channel=User.aggregate([
    {
      $match:{
        userName:userName?.toLowercase()
      }
    },
    {
      $lookup:{
        from:"subcriptions",
        localfield:"_id",
        foreignField:"channel",
        as:"subscribers"
      }
    },
    {
      $lookup:{
        from:"subcriptions",
        localfield:"_id",
        foreignField:"subscriber",
        as:"subscribedTo"
      }
    },
    {
      addFields:{
        subscriberCount:{
          $size:"$subscriber"
        },
        channelsybscribeToCount:{
          $size:"$subscribedTo"
        },
        isSybscribed:{
          $cond:{
            if:{$in:[req.user?._id,"$subscriber.subscriber"]},
            then:true,
            else:false
    
          }
        }
      }
    },
    {
      $project:{
        userName:1,
        Email:1,
        FullName:1,
        Avatar:1,
        CoverImage:1,
        subscriberCount:1,
        channelsybscribeToCount:1,
      }
    }
  ])
  console.log(channel)
  if(!channel?.length){
    throw new ApiError(404,'chennel does not exists')
  }
  return res
  .status(200)
  .json(
    new ApiResponse(200,channel,'channel is created')
  )
 })
 

export { 
  userragister,
  LoginUser,
  logoutUser,
  changeCurrentUser,
  getcurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelprofile
} 