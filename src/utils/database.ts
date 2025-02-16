import mongoose from "mongoose";
import logger from "./logger";

export const connectToDB = async (): Promise<void> => {
    const dbUri = process.env.MONGODB_URI;

    if (!dbUri) {
        logger.error("MONGODB_URI is not defined the .env file.");
        throw new Error("Missing MONGODB_URI");
    }

    try {
        await mongoose.connect(dbUri);
        logger.canyon("MongoDB is connected.");
    } catch (err) {
        logger.error("Failed to connect to MongoDB. Ensure it is installed and running.");
        throw err;
    }
};
