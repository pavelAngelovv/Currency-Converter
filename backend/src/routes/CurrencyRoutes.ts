import { Router } from "express";
import { getCurrencies, updateCurrency } from "../controllers/currencyController.ts";

const router = Router();

router.get("/currencies", getCurrencies);
router.post("/currencies/update", updateCurrency);

export default router;