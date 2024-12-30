import mongoose, { SchemaType } from "mongoose";
import bcrypt, { compare } from "bcrypt"
import jwt from "jsonwebtoken";



const UserSchema=mongoose.Schema(
 {
   userName:{
    type:String,
    required:true,
    lowercase:true,
    trim:true,
    unique:true,
    index:true
   },
   Email:{
    type:String,
    required:true,
    lowercase:true,
    trim:true,
    unique:true
   },
   FullName:{
    type:String,
    required:true,
    lowercase:true
    
   },
   Avatar:{
    type:String, // cloudnary
    required:true,
   },
   CoverImage:{
    type:String,//cloundary

   },
   Password:{
    type:String,
    unique:true,
    required:true,

   },
   RefreshToken:{
    type:String,
    required:false,
    unique:true
   },
   WatchHistory:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Video",
    index:true
   }
 }
 
 ,{timestamps:true})


UserSchema.pre("save",async function(next) {
     if(this.isModified("Password")){
      this.Password= await bcrypt.hash(this.Password,10)
     }
     else{
       next()
     }
})

UserSchema.methods.isPasswordIscorrect= async function(Password){
   return await bcrypt.compare(Password,this
    .Password)
}

UserSchema.methods.genrateAccessToken=async function(){
   const Token= await jwt.sign
   (
        {
           _id:this._id,
           email:this.Email,
            user:this.User
         },
           process.env.ACCESS_TOKEN_SECRATE,
         {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
         }

  )
  return Token
}

UserSchema.methods.genratRefreshToken=async function(){
 const Token=  await jwt.sign
 (
      {
          _id:this._id,
          email:this.Email,
          user:this.User
       },
         process.env.REFRESH_TOKEN_SECRATE,
       {
      expiresIn:process.env.REFRESH_TOKEN_EXPIRY
       }

)
return Token
}
















 // UserSchema.pre("save",async function(next){
 //    if(this.isModified("password")){
 //     this.Password=bcrypt.hash("password",10)
 //    }
 //   else{
 //    next()
 //   }
 // })

 // UserSchema.methods.isPasswordCorrect= async function (password) {
 //  return await bcrypt.compare(password,this.Password)
 // }

 // //jwt is a bearar token

 // UserSchema.methods.GenrateAccessToken=function(){
 //  return jwt.sign(
 //   {
 //    _id:this._id,
 //    emial:this.Email,
 //    UserName:this.UserName,
 //    FullName:this.FullName
 //   },
 //   process.env.ACCESS_TOKEN_SECRATE,
 //   {
 //    expiresIn:process.env.ACCESS_TOKEN_EXPIRY
 //   }

 //  )
 // }
 // UserSchema.methods.GenrateRefreshToken=function(){
 //  return jwt.sign(
 //   {
 //   _id:this._id
 //   },
 //   process.env.REFRESH_TOKEN_SECRATE,
 //   {
 //    expiresIn:process.env.REFRESH_TOKEN_EXPIRY
 //   }
 // )
 // }







 export const User=mongoose.model("User",UserSchema)
 
 