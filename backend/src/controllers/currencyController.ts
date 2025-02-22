import { Request, Response } from 'express';
import { fetchCurrencies, convertCurrencies } from '../services/currencyService.ts';

export const getCurrencies = async (req: Request, res: Response) => {
  try {
    const currencies = await fetchCurrencies();
    res.json(currencies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch currency data' });
  }
};

export const updateCurrency = async (req: Request, res: Response) => {
  try {
    const { baseCurrency, amount } = req.body;
    const convertedCurrencies = await convertCurrencies(baseCurrency, amount);
    res.json(convertedCurrencies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to convert currencies' });
  }
};
