import express, { Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import axios from "axios";
import CurrencyModel from "./models/currencyModel.ts";
import { getCurrencies, updateCurrency } from "./controllers/currencyController.ts";

const API_URL = process.env.EXCHANGE_API_URL || "https://api.exchangerate-api.com/v4/latest/USD";

const app = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/currency")
  .then(() => {
    console.log("Database connected!");
    fetchCurrencies(); 
  })
  .catch((err) => {
    console.error("Database connection error", err);
  });

const fetchCurrencies = async () => {
  const lastUpdated = await CurrencyModel.findOne().sort({ timestamp: -1 });

  if (lastUpdated && Date.now() - new Date(lastUpdated.timestamp).getTime() < 2 * 60 * 60 * 1000) {
    console.log("Returning data from the database");
    return;
  }

  console.log("Updating data...");
  const response = await axios.get(API_URL);
  const rates = response.data.rates;

  for (const [name, value] of Object.entries(rates)) {
    const existingCurrency = await CurrencyModel.findOne({ name });

    if (existingCurrency) {
      await CurrencyModel.updateOne({ name }, { value, timestamp: Date.now() });
    } else {
      await CurrencyModel.create({ name, value, timestamp: Date.now() });
    }
  }
};

app.get("/api/currencies", getCurrencies);
app.post("/api/currencies/update", updateCurrency);

app.listen(port, () => console.log(`Server is running on port ${port}`));