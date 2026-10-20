import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

// Runs before any test file is loaded, so routes read these values
// instead of the ones in .env
const mongo = await MongoMemoryServer.create();
process.env.MONGODB_URI = mongo.getUri();
process.env.DB_NAME = "test";
process.env.JWT_SECRET = "test-secret";

export const mochaHooks = {
  async beforeAll() {
    await mongoose.connect(mongo.getUri(), { dbName: "test" });
  },
  async afterAll() {
    await mongoose.disconnect();
    await mongo.stop();
  },
};
