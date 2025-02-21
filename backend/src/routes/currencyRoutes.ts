import express from "express";
import { getCurrencies } from "../controllers/currencyController.ts";

const router = express.Router();

router.get("/", getCurrencies);

export default router;
