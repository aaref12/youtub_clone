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

// const getVideoById = asyncHandler(async (req, res) => {
//     const { videoId } = req.params
//     //TODO: get video by id
// })

// const updateVideo = asyncHandler(async (req, res) => {
//     const { videoId } = req.params
//     //TODO: update video details like title, description, thumbnail

// })

// const deleteVideo = asyncHandler(async (req, res) => {
//     const { videoId } = req.params
//     //TODO: delete video
// })

// const togglePublishStatus = asyncHandler(async (req, res) => {
//     const { videoId } = req.params
// })

export {
    getAllVideos,
    publishAVideo,
    // getVideoById,
    // updateVideo,
    // deleteVideo,
//     togglePublishStatus
}
