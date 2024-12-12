import cors from "cors";
import shopping from "./src/api/shopping.js";
// import appEvents from "./src/api/app-events.js";
import express from "express";
import dotenv from "dotenv";
import errorHandler from "./utils/error-handler.js";
dotenv.config("/.env");
const expressApp = async (app) => {
  app.use(express.json());
  app.use(cors());
  shopping(app);
  //   appEvents(app);
  app.use(errorHandler);
};

export default expressApp;
