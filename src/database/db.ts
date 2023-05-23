import mongoose, { ConnectOptions } from "mongoose";

export default async function connectToMongoDB(): Promise<void> {
    if(process.env.DATABASE_URL){
        await mongoose.connect(process.env.DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        } as ConnectOptions);

        console.log("Connected to MongoDB");
    } else {
        console.log("Failed to connect to MongoDB");
    }
}