import mongoose from "mongoose";

export const connectDb = async() =>{
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log(`DB connected`);
        
    } catch (error) {
        console.log("DB error : ", error);
    }
}