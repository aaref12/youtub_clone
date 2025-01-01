import mongoose from 'mongoose'


const subcriptionSchema=mongoose.Schema({
subscriber:{
 type:mongoose.Schema.ObjectId,
 ref:"User"
},
channel:{
 type:mongoose.Schema.ObjectId,
 ref:"User"
}




},{timestamps:true})


export const Subcription=mongoose.model("Subcription",subcriptionSchema)