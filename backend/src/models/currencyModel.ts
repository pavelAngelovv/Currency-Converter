import { Schema, model } from "mongoose";

const currencySchema = new Schema({
  name: { type: String, required: true },
  value: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

const CurrencyModel = model("Currency", currencySchema);

export default CurrencyModel;
