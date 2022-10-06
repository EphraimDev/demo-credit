import { Router } from "express";
import { validateUser } from "../../middlewares";
import UserController from "./controller";
import UserValidator from "./validator";

const router = Router();

router.post("/signup", UserValidator.signupValidation, UserController.signUp);

router.post("/login", UserValidator.loginValidation, UserController.login);
router.get("/profile", validateUser, UserController.userProfile);

export default router;
