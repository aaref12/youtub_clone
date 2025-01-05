import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from '../utiles/apierr.js'
import {ApiResponse} from '../utiles/ApiResponse.js';
import {asynchandler} from '../utiles/asynchandler.js'
import {uplodeOnCloudnary} from "../utiles/cloundanary.js"
import ffmpeg from 'fluent-ffmpeg'


const getAllVideos = asynchandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    
   //TODO: get all videos based on query, sort, pagination
   const videos = await Video.aggregate([
     {
       $match: {
         $or: [
           {
             title: { $regex: query, $options: "i" },
           },
           {
             description: { $regex: query, $options: "i" },
           },
         ],
       },
     },
     {
       $lookup: {
         from: "users",
         localField: "owner",
         foreignField: "_id",
         as: "createdBy",
       },
     },
     {
       $unwind: "$createdBy",
     },
     {
       $project: {
         thumbnail: 1,
         videoFile: 1,
         title: 1,
         description: 1,
         createdBy: {
           fullName: 1,
           username: 1,
           avatar: 1,
         },
       },
     },
     {
       $sort: {
         [sortBy]: sortType === "asc" ? 1 : -1,
       },
     },
     {
       $skip: (page - 1) * limit,
     },
     {
       $limit: parseInt(limit),
     },
   ]);
 
   return res
     .status(200)
     .json(new ApiResponse(200, videos, "Fetched All Videos"));
 });

const publishAVideo = asynchandler(async (req, res) => {
    const { title, discription ,videoFile,Thumbnail} = req.body
    // TODO: get video, upload to cloudinary, create video
    if( !discription){
     throw new ApiError(404,"title and Discription is required")
    }
    if( !title){
     throw new ApiError(404,"title and Discription is required")
    }
    console.log(title)
    console.log(discription)
     const videolocalpath= req.files?.videoFile[0]?.path
     const videoThumnailpath=req.files?.Thumbnail[0].path

     const uploadvideo=await uplodeOnCloudnary(videolocalpath)
     const uploadthumnail=await uplodeOnCloudnary(videoThumnailpath)
     if(!uploadvideo || !uploadthumnail){
      throw new ApiError(401,'videoFile is not uploaded');
     }
console.log(videolocalpath)

    const video= await Video.create({
     videoFile:videolocalpath,
     Thumbnail:videoThumnailpath,
     Owner:User._id,
     title,
     //Duration:Video.Duration,
     discription
     })
     console.log(video)
     if(!video){
      throw new ApiError(500,'some technival issu')
     }
     return res
     .status(200)
     .json(new ApiResponse(200,video,"video successfully uploaded"))
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id

    if(!isValidObjectId(videoId)){
      throw new ApiError(404,'invalide video Id')
    }

   const video=await Video.findById(videoId)
   if(!video){
    throw new ApiError(404,'video is not found')
   }

   return res
   .status(200)
   .json(200,videoId,'video is fatched')


})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    // find video id


        if(!isValidObjectId(videoId)){
          throw new ApiError(404,'invalide videoId')
        }

       //request data from user
        const {title,description}=req.body
        if(!title || !description){
          throw new ApiError(401,'title and decription is required')
        }


      //thumnail from user        
        const thumnailfromUser=req.file?.path
        if(!thumnailfromUser){
          throw new ApiError(401,'thumnail is required')
        }


        //uploade thumnail on cloundnary
        const uploadthumnail=await uplodeOnCloudnary(thumnailfromUser)
        if(!uploadthumnail){
          throw new ApiError(500, 'thumnail is not uplaoded on cloundanry')
        }


        //find video help of videoId
       const video=await Video.findById(videoId)

       
       
       
       
       if(!video){
         throw new ApiError(405,'video id not found')
        }



        // math video owner and user
      if(video.Owner !==req.user._id){
        throw new ApiError('video owner and user not match ')
      }
       const updateVideo=await Video.findByIdAndUpadate(
        videoId,{
          $set:{
            title,
            description,
            Thumbnail:uploadthumnail

          }
        },
        {
          new:true
        }
       )
  
      return res
      .status(200)
      .json(200,updateVideo,'video upadted successfully')
    
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video

    if(!isValidObjectId(videoId)){
      throw new ApiError(404,'video id is not valide')
    }


    const video=await Video.findById(videoId)
    if(!video){
          throw new ApiError(404,'video id is  not found')
    }


    if (video.Owner !== req.user._id){
      throw new ApiError(400,'inavlide user')
    }

    const dilateVideoCloundnary=await deleteFromCloudinary(video.videoFile)
    if(!dilateVideoCloundnary){
      throw new ApiError(400,'video is not deleted')
    }
  
    const dilatethumbnailCloundinary=await deleteFromCloudinary(video.Thumbnail)
    if(!dilatethumbnailCloundinary){
      throw new ApiError(400,'thumbnail is not deleted')
    }
    const dilateVideo=await video.findByIdAndDelete(videoId)
    if(!dilateVideo){
      throw new ApiError(500,'video is not dilate')
    }
     return res
     .status(200)
     .json(200,'video dilate success fully')
    
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if(!isValidObjectId(videoId)){
      throw new ApiError(401,'object id is not valide')
    }
    const video=Video.findById(videoId)
    if(!video){
      throw new ApiError(400,'videoid is not found')
    }
    if(video.Owner !==req.user._id){
      throw new ApiError(404,'user is not match')
    }
    const toglevideopublished=await video.findByIdAndUpadate(
      videoId,
      {
        $set:{
          ispubisPublished:!video.published
        }
      },
      {
        new:true
      }
    )

    return res
    .status(200)
    .json(200,toglevideopublished,'ttoglevideopublished success')
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
//     togglePublishStatus
}
