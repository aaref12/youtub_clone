import {ApiError} from '../utiles/apierr.js'
import {User} from '../models/user.model.js';
import {uplodeOnCloudnary} from '../utiles/cloundanary.js'
import { ApiResponse } from '../utiles/ApiResponse.js';

// import {ApiError} from '../utiles/apierr.js'
// import {User} from '../models/user.model.js'
// import {uploadOnCloudnary} from '../utiles/cloundanary.js';
// import {ApiResponse} from '../utiles/ApiResponse.js'

const userragister=async (req,res)=>{
  //get users detauils from front end
  //validation :empty user details: not empty
  //check if user already exists   :username ,email
  //check for images, check for avatar
  //uplode the cloudnary ,avatar check
  //create user object-creation entry in db
  //remove password and refresh token filed from response
  //check user creation
  //return res
 

   
   
//     const {userName,Email,FullName,Password}=req.body
//     if(userName===""){
//       throw new ApiError(401,"UserName is not define")
//     }
//     console.log(userName)
//     if(Email===""){
//       throw new ApiError(402,"Email is not define")
//     }
//     console.log(Email)
//     if(FullName===""){
//       throw new ApiError(401,"FullName is not define")
//     }
//     console.log(FullName)
//     if(Password===""){
//       throw new ApiError(401,"Password is not define")
//     }
//     console.log(Password)

//     const existedUser=User.findOne({
//       $or:[{userName},
//         {Email}]
//     })

//     if(existedUser){
//       throw new ApiError(403,"user is already existed in data base")
//     }
//     console.log(existedUser)



//     const LocalfilaImage=req.files?.avatar[0]?.path;
//     const LocalfileCoverIamge= req.files?.coverImage[0]?.path;

//     if(!LocalfilaImage){
//       throw new ApiError(404,"please insert avatar")
//     }
//   const uploadavatar= await uploadOnCloudnary(LocalfilaImage)
//   const uploadCoverImage= await uploadOnCloudnary(LocalfileCoverIamge)

//   if(!uploadavatar){
//     throw new ApiError(500,'server is busy please try again')
//   }

//   const user=await User.create({
//     FullName,
//     userName,
//     Email,
//     Password,
//     avatar:avatar?.url,
//     coverIamge:coverIamge?.url
//    })
// const createUser=await User.findById(user._Id).select(
//   "-Password -RefreshToken"
// )
// if(!createUser){
//   throw new ApiError(500,'somthing is wrong')
// }

// //res.status(200).json(userragister)

// return res.status(201).json(
//     new ApiResponse(200,createdUser,"user ragisterd successfully")
//    )








//part 01



 const  {userName,Email,FullName,Password}=req.body
 console.log(Email)
 if(userName===""){
  throw new ApiError(400,"userName is not define")
 }
 if(FullName===""){
  throw new ApiError(400,"fullName is not define")
 }
 if(Email===""){
  throw new ApiError(400,"email is not define")
 }
 if(Password===""){
  throw new ApiError(400,"password is not define")
 }

//  if(
//   [FullName,Email,userName,Password].some((field)=>
//     field.trim()==="")
//  ){
//   throw new apierr (400,"all fields are required ")
//  }
 const exitedUser= User.findOne({
    $or:[{ userName },{ Email }]
  })

  if(exitedUser){
    throw new ApiError(404,"userName is already existed")
  }
  const avatarLocalPath=req.files?.avatar[0]?.path;
  const coverImageLocalPath=req.files?.coverImage[0]?.path;
  if(!avatarLocalPath){
   throw new ApiError(400,'avatar is required')
  }
 const avatar= await uplodeOnCloudnary(avatarLocalPath)
 const coverImage=await uplodeOnCloudnary(coverImageLocalPath)
 if(!avatar){
  throw new ApiError(400,'avatar is required')
 }
  const user= await User.create({
  FullName,
  userName:userName.tolowercase(),
  Email,
  avatar:avatar.url,
  coverImage:coverImage?.url || "",
  Password
 })
 const  createdUser=await User.findById(user._id).select(
  "-Password -RefreshToken"
 )
 if(!createdUser){
  throw new ApiError(500,"somthing want wrong")
 }
 return res.status(201).json(
  new ApiResponse(200,createdUser,"user ragisterd successfully")
 )
  

}

export default userragister