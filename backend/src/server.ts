import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import currencyRoutes from "./routes/CurrencyRoutes.ts";
import { updateCurrencies } from "./services/currencyService.ts";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/currency")
  .then(async () => {
    console.log("Database connected!");
    await updateCurrencies();
  })
  .catch((err) => {
    console.error("Database connection error", err);
  });

app.use("/api", currencyRoutes);

app.listen(port, () => console.log(`Server is running on port ${port}`));
