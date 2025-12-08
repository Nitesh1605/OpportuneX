
import mongoose from "mongoose";

const connectDB = async (retries = 5, delayMs = 2000) => {
  let uri = process.env.MONGO_URI as string;
  if (uri) {
    uri = uri.trim().replace(/^['"]|['"]$/g, "");
  }
  if (!uri) {
    console.error("MONGO_URI not set in .env");
    process.exit(1);
  }

  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(uri, {
        // options if needed; mongoose v7+ has sensible defaults
        serverSelectionTimeoutMS: 5000,
      } as any);
      console.log("✅ MongoDB connected");
      return;
    } catch (err: any) {
      console.error(`❌ MongoDB connection attempt ${i + 1} failed:`, err.message || err);
      if (i < retries - 1) {
        console.log(`Retrying in ${delayMs}ms...`);
        await new Promise((r) => setTimeout(r, delayMs));
      } else {
        console.error("All retries failed. Exiting.");
        process.exit(1);
      }
    }
  }
};

export default connectDB;
