import { body } from "express-validator";

export const validateCurrencyUpdate = [
    body("name").isString().withMessage("Currency name must be a string"),
    body("value").isNumeric().withMessage("Value must be a number"),
];