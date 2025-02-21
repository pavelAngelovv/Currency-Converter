import { Request, Response } from "express";
import { fetchCurrencies } from "../services/currencyService.ts";

export const getCurrencies = async (req: Request, res: Response) => {
  try {
    const currencies = await fetchCurrencies();
    res.json(currencies);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch currency data" });
  }
};
