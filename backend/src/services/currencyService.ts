import CurrencyModel from '../models/currencyModel.ts';

export const fetchCurrencies = async () => {
  const currencies = await CurrencyModel.find();
  return currencies;
};

export const convertCurrencies = async (baseCurrency: string, amount: number) => {
  const currencies = await CurrencyModel.find();
  const baseCurrencyData = currencies.find((c) => c.name === baseCurrency);

  if (!baseCurrencyData) throw new Error('Base currency not found');

  const conversionRates = currencies.reduce((acc, currency) => {
    const convertedValue = (currency.value / baseCurrencyData.value) * amount;
    acc[currency.name] = convertedValue;
    return acc;
  }, {} as Record<string, number>);

  return conversionRates;
};
