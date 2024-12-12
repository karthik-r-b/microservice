import logger from "./src/middleware/logger.js";
import path from "path";
import fs from "fs";
import expressApp from "./app.js";
import express from "express";
import dbConnection from "./database/connection.js";
const PORT = process.env.PORT;
const app = express();
const startServer = async () => {
  const logFile = path.join(path.dirname(""), process.env.LOG_FILE);
  // Check if the log file exists
  if (!fs.existsSync(logFile)) {
    // Log file does not exist, create it
    fs.writeFileSync(logFile, "");
  }
  await expressApp(app);
  await dbConnection();
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${process.env.PORT}`);
  });
  process.on("unhandledRejection", (err, promise) => {
    logger.error(
      `Unhandled Rejection at Promise: ${promise} for the error: ${err}`
    );
    process.exit(1);
  });
};
startServer();