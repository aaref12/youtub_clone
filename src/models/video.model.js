import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const VideoSchema=mongoose.Schema(
 {
  videoFile:{
    type:String,
    unique:true,
    required:true,
    index:true,
   },
   Thumbnail:{
    type:String,
    required:true,
   },
   Owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
   },
   title:{
    type:String,
    required:true,
   },
   Duration:{
    type:Number,
    //required:true,
   },
   discription:{
    type:String,
    required:true
   },
   Views:{
    type:Number,
    required:true,
    default:0
   },
   IsPublished:{
    type:Boolean,
    default:true,
   }
 }
,{timestamps:true})


VideoSchema.plugin(mongooseAggregatePaginate)

export const Video=mongoose.model("Video",VideoSchema)