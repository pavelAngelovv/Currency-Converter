import express, { Request, Response } from "express";
import mongoose from "mongoose";
import currencyRoutes from "./routes/currencyRoutes.ts";

const app = express();

const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/currency")
  .then(() => {
    console.log("Database connected!");
  })
  .catch((err) => {
    console.error("Database connection error", err);
  });

app.use("/api/currencies", currencyRoutes);

app.listen(port, () => console.log(`Server is running on port ${port}`));