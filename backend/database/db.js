import mongoose from "mongoose";

export const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URl , {
            dbName: "Taggle",
        });

        console.log("Connected to MongoDB");
    } catch (error) {
        console.log(error);
    }
};