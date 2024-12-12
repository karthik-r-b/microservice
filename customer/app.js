import cors from "cors";
import customer from "./src/api/customer.js";
import appEvents from "./src/api/app-events.js";
import express from "express";
import dotenv from "dotenv";
import errorHandler from "./utils/error-handler.js";
dotenv.config("/.env");
const expressApp = async (app) => {
  app.use(express.json());
  app.use(cors());
  customer(app);
  appEvents(app);
  app.use(errorHandler);
};

export default expressApp;
