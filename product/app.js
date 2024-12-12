import cors from "cors";
import product from "./src/api/product.js";
// import appEvents from "./src/api/app-events.js";
import express from "express";
import dotenv from "dotenv";
import errorHandler from "./utils/error-handler.js";
dotenv.config("/.env");
const expressApp = async (app) => {
  app.use(express.json());
  app.use(cors());
  product(app);
  //   appEvents(app);
  app.use(errorHandler);
};

export default expressApp;
