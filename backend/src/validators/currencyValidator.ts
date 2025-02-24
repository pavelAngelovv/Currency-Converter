import { body } from "express-validator";

export const validateCurrencyUpdate = [
    body("baseCurrency").isString().withMessage("Currency name must be a string"),
    body("amount").isNumeric().withMessage("Amount must be a number"),
];