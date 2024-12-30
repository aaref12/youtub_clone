import { v2 as cloudinary } from "cloudinary";
import fs from "fs";


cloudinary.config({ 
 cloud_name:process.env.CLOUDINAR_CLOUD_NAME, 
 api_key: process.env.CLOUDINAR_API_KEY, 
 api_secret: process.env.CLOUDINAR_API_SECRATE // Click 'View API Keys' above to copy your API secret
});

const uplodeOnCloudnary= async (localfilepath)=>{
 try {
         if(!localfilepath) return null
        //uplod the file on cloundanry
        const response=await cloudinary.uploader.upload(localfilepath,{
         resource_type:"auto"
        })
        //file has been uploded successfully
        console.log(`:file uploded success fully on cloundanar ${response.url}`)

        fs.unlinkSync(localfilepath);
        return response;
 } catch (error) {
  fs.unlinkSync(localfilepath) // remove the locally seved file
  return null;

 }
}

export {uplodeOnCloudnary}