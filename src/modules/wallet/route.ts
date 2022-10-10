import { Router } from "express";
import { validateUser } from "../../middlewares";
import WalletController from "./controller";

const router = Router();

router.get("/", validateUser, WalletController.getWalletDetails);

export default router;
