import express from "express";
import proxy from "express-http-proxy";
import cors from "cors";
import dotenv from "dotenv";

const app = express();

dotenv.config("/.env");

app.use(cors());
app.use(express.json());

app.use("/customer", proxy("http://localhost:8001"));
app.use("/product", proxy("http://localhost:8002"));
app.use("/shopping", proxy("http://localhost:8003"));

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

process.on("unhandledRejection", (err, promise) => {
  console.error("Unhandled Rejection:", err.message);
  process.exit(1);
});
