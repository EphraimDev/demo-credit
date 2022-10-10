import { Router } from "express";
import { validateUser } from "../../middlewares";
import TransactionController from "./controller";
import TransactionValidator from "./validator";

const router = Router();

router.post(
  "/fund",
  validateUser,
  TransactionValidator.fundWalletValidation,
  TransactionController.fundWallet
);
router.post(
  "/transfer",
  validateUser,
  TransactionValidator.transferValidation,
  TransactionController.walletToWalletTransfer
);
router.post(
  "/withdraw",
  validateUser,
  TransactionValidator.fundWalletValidation,
  TransactionController.walletWithdrawal
);

export default router;
