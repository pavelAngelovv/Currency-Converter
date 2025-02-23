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
      Number(((currency.value / baseCurrencyData.value) * amount).toPrecision(5)),
    ])
  );
};
