import mongoose from "mongoose";
import "dotenv/config";

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("okey");
  } catch (error) {
    console.error("Error connectant a MongoDB:", error.message);
    process.exit(1);
  }
}

export default connectDB;
