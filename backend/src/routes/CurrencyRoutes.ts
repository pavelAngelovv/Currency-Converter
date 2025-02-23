import { Router } from "express";
import { getCurrencies, updateCurrency } from "../controllers/currencyController.ts";
import { validateCurrencyUpdate } from "../validators/currencyValidator.ts";
import { handleValidationErrors } from "../middlewares/errorHandler.ts";

const router = Router();

router.get("/currencies", getCurrencies);
router.post("/currencies/update", validateCurrencyUpdate, handleValidationErrors, updateCurrency);

export default router;
