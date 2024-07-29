import mongoose from "mongoose";

export default async function connectMongoDB() {
    try{
        const connection = await mongoose.connect(process.env.MONGO_DB_URI)
        console.log(`MongoDB connected. \nHost: ${connection.connection.host}`)
    } catch (error) {
        console.log(`\nError Connecting to database: ${error.message}`)
        process.exit(1);
    }
}
