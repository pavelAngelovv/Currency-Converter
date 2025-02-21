import axios from "axios";
import CurrencyModel from "../models/currencyModel.ts";

const API_URL = process.env.EXCHANGE_API_URL || "https://api.exchangerate-api.com/v4/latest/USD";

export const fetchCurrencies = async () => {
    const lastUpdated = await CurrencyModel.findOne().sort({ timestamp: -1 });
  
    if (lastUpdated && (Date.now() - new Date(lastUpdated.timestamp).getTime() < 2 * 60 * 60 * 1000)) {
      return lastUpdated;
    }
  
    const response = await axios.get(API_URL);
    const rates = response.data.rates;
  
    await CurrencyModel.create({ name: "USD", value: 1 });
    Object.entries(rates).forEach(async ([name, value]) => {
      await CurrencyModel.create({ name, value });
    });
  
    return rates;
  };
