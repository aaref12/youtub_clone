import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";



const connectDB=async()=>{
   try {
      const db_connect=await mongoose.connect(`${process.env.DATABASE_URI}/${DB_NAME}`)
      console.log(`data base succesfully connected ${db_connect.connection.host}`)
   } catch (error) {
      console.log(`data base are not connected ${error}`)
   }
}
export default connectDB
























































// import mongoose  from "mongoose";
// import { DB_NAME } from "../constants.js";



// const connectDB= async ()=>{
//  try {
//     const connectdbinst=await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
//     console.log(`\n mongoose sucessfully connected ${connectdbinst.connection.host}`);

//  } catch (error) {
//   console.log("\n mongoodb connection failed",error);
//   process.exit(1)
//  }
// }

// export default connectDB