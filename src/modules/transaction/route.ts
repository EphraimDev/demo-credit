import { Router } from "express";
import { validateUser } from "../../middlewares";
import TransactionController from "./controller";
import TransactionValidator from "./validator";

const router = Router();

router.post(
  "/fund",
  validateUser,
  TransactionValidator.fundAccountValidation,
  TransactionController.fundAccount
);
router.post(
  "/transfer",
  validateUser,
  TransactionValidator.transferValidation,
  TransactionController.accountToAccountTransfer
);

export default router;
