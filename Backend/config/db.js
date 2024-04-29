import mongoose from "mongoose";
import dotenv from "dotenv";

const dot = dotenv.config( { path: 'Backend/config/.env'} )

const connectDB = async () => {
    mongoose.set('strictQuery', false);

    try {
        console.log('Connecting to MongoDB...');
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
        console.log(`Mongo DB is connected : ${conn.connection.host}`);

    } catch (error) {
        console.error('Error connecting to MongoDB:', error)
    }
}

export default connectDB;
