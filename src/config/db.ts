import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("✅ MongoDB connecté");
  } catch (error) {
    console.error("❌ Erreur MongoDB :", (error as Error).message);
    process.exit(1);
  }
};

export default connectDB;
