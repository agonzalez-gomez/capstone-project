import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

const clientURI = process.env.MONGODB_URI ?? "";
const databaseName = process.env.DB_NAME ?? "";

console.log("MongoDB URI set:", Boolean(clientURI), "DB:", databaseName);

async function getDatabase(): Promise<typeof mongoose | false> {
  // If Mongoose is already connected, return the existing connection instance
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  try {
    // Connect Mongoose to the URI and specify the database name
    await mongoose.connect(clientURI, {
      dbName: databaseName,
    });

    console.log("✅ Connected to MongoDB via Mongoose");
    return mongoose;
  } catch (err) {
    console.error("❌ Mongoose connection failed", err);
    return false;
  }
}

export default getDatabase;
