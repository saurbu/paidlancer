import mongoose from 'mongoose'

const connnectDb = async () =>{
    try{
        await mongoose.connect(process.env.MONGODB_URI)

        console.log("db connected")
        
    }catch(err){
        console.error("db connection error", err)
        process.exit(1)
        
    }
}


export default connnectDb