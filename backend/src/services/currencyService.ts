import { Request, Response } from 'express';
import CurrencyModel from '../models/currencyModel.ts';
import axios from "axios";

const API_URL = process.env.EXCHANGE_API_URL || "https://api.exchangerate-api.com/v4/latest/USD";

export const fetchCurrencies = async () => {
  const currencies = await CurrencyModel.find();
  return currencies;
};

export const updateCurrencies = async () => {
  const lastUpdated = await CurrencyModel.findOne().sort({ timestamp: -1 });

  if (lastUpdated && Date.now() - new Date(lastUpdated.timestamp).getTime() < 2 * 60 * 60 * 1000) {
    console.log("Returning data from the database");
    return;
  }

  console.log("Updating data...");
  const response = await axios.get(API_URL);
  const rates = response.data.rates;

  for (const [name, value] of Object.entries(rates)) {
    await CurrencyModel.updateOne({ name }, { value, timestamp: Date.now() }, { upsert: true });
  }
};

export const convertCurrencies = async (baseCurrency: string, amount: number) => {
  const currencies = await CurrencyModel.find();
  const baseCurrencyData = currencies.find((c) => c.name === baseCurrency);

  if (!baseCurrencyData) throw new Error('Base currency not found');

  return Object.fromEntries(
    currencies.map((currency) => [
      currency.name,
      Number(((currency.value / baseCurrencyData.value) * amount).toFixed(4)),
    ])
  );
};

export const getSortedCurrencies = async (req: Request, res: Response) => {
  try {
    const { sortBy = "name", order = "asc" } = req.query;

    const validSortFields = ["name", "value"];
    if (!validSortFields.includes(sortBy as string)) {
      res.status(400).json({ error: "Invalid sort field" });
      return
    }

    const sortOrder = order === "desc" ? -1 : 1;

    const currencies = await CurrencyModel.find().sort({ [sortBy as string]: sortOrder });

    res.status(200).json(currencies);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sorted currencies" });
  }
};
