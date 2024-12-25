const asynchandler= (requestHander)=>{
    return (req,res,next)=>{
          Promise
          .resolve(requestHander(req,res,next))
          .catch((err)=>next(console.log(err)))
         }
}


export { asynchandler}



// const asynchandler1=(fn)=> async(req,res,next)=>{
//  try {
//    await fn(req,res,next)
//  } catch (error) {
//   res.status(error.code || 500).json({
//    success:false,
//    message:error.message
//   })
//  }
// }
// export {asynchandler1}