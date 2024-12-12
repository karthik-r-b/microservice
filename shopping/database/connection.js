import mongoose from "mongoose";
import logger from "../src/middleware/logger.js";
const DB_URL = process.env.DB_URL;

const dbConnection = async () => {
  try {
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info("Successfully connected to the database.");
  } catch (error) {
    logger.error(`Error connecting to database: ${error}`);
    process.exit(1);
  }
};

export default dbConnection;
