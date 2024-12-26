import mongoose from "mongoose";
import { MONGODB_URI } from "../global/env";

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 0 && MONGODB_URI) {
      await mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 30000,
      } as mongoose.ConnectOptions);
      console.log("MongoDB connected successfully");
    }
    mongoose.set("bufferCommands", false);
  } catch (error) {
    console.error("MongoDB connection error: ", error);
    throw new Error("Database connection failed");
  }
};

export default connectDB;