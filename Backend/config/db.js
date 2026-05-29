import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.
MONGO_URI);
    console.log("MongoDB Connected from project");
  } catch (error) {
    console.error("Mongo Error:", error);
    process.exit(1);
  }
};

export default connectDB;

