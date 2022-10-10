import { Request, Response } from "express";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { IGetUserAuthInfoRequest } from "../../../types/express";
import { handleResponse } from "../../middlewares";
import UserService from "./service";
import AccessToken from "../../utils/accessToken";
import WalletService from "../wallet/service";
import { WalletInterface, WalletWhereInterface } from "../../database/types";
import TransactionService from "../transaction/service";

dotenv.config();

class UserController {
  static async signUp(req: Request, res: Response) {
    const { first_name, last_name, password, email, phone_number } = req.body;

    try {
      const find_user = await UserService.findUsers({ phone_number });
      if (!find_user)
        return handleResponse(
          req,
          res,
          { status: "error", message: "Invalid phone number or password" },
          400
        );
      if (find_user.length > 0)
        return handleResponse(
          req,
          res,
          {
            status: "error",
            message: "User with this phone number already exist",
          },
          400
        );

      const hashedPassword = bcrypt.hashSync(
        password,
        Number(process.env.BCRYPT_SALT)
      );
      const user = await UserService.addUserToDatabase({
        first_name,
        last_name,
        email,
        phone_number,
        password: hashedPassword,
      });

      if (!user)
        return handleResponse(
          req,
          res,
          {
            status: "error",
            message: "Unable to create user. Please try again",
          },
          400
        );

      WalletService.addWalletToDatabase({
        user_id: user[0],
        nuban: phone_number,
      });

      return handleResponse(
        req,
        res,
        { status: "success", message: "User created successfully" },
        201
      );
    } catch (error: any) {
      return handleResponse(
        req,
        res,
        { status: "error", message: error.message },
        500
      );
    }
  }

  static async login(req: Request, res: Response) {
    const { password, phone_number } = req.body;

    try {
      const find_user = await UserService.findUsers({ phone_number });
      if (!find_user)
        return handleResponse(
          req,
          res,
          { status: "error", message: "Invalid phone number or password" },
          400
        );
      if (find_user.length === 0)
        return handleResponse(
          req,
          res,
          {
            status: "error",
            message: "User with this phone number does not exist",
          },
          400
        );
      const user = find_user[0];

      if (!user.password)
        return handleResponse(
          req,
          res,
          { status: "error", message: "Invalid phone number or password" },
          400
        );

      const is_password_correct = bcrypt.compareSync(
        password.trim(),
        user.password
      );
      if (!is_password_correct)
        return handleResponse(
          req,
          res,
          { status: "error", message: "phone number or password is incorrect" },
          401
        );

      if (user.is_blocked)
        return handleResponse(
          req,
          res,
          {
            status: "error",
            message: "User is blocked",
          },
          401
        );

      if (!user.is_verified)
        return handleResponse(
          req,
          res,
          {
            status: "error",
            message: "User is not verified",
          },
          401
        );

      const token = await AccessToken({
        id: user.id,
        phone_number: user.phone_number,
      });
      if (!token)
        return handleResponse(
          req,
          res,
          {
            status: "error",
            message: "Failed to login. Please try again",
          },
          401
        );

      await UserService.updateUser({ id: user.id }, { token });
      return handleResponse(
        req,
        res,
        {
          status: "success",
          message: "User login successfully",
          data: {
            user: {
              id: user.id,
              email: user.email,
              first_name: user.first_name,
              last_name: user.last_name,
              phone_number: user.phone_number,
            },
            token,
          },
        },
        200
      );
    } catch (error: any) {
      return handleResponse(
        req,
        res,
        { status: "error", message: error.message },
        500
      );
    }
  }

  static async userProfile(req: IGetUserAuthInfoRequest, res: Response) {
    const user = req.user;
    if (!user)
      return handleResponse(
        req,
        res,
        { status: "error", message: "Unauthorized" },
        401
      );
    try {
      return handleResponse(
        req,
        res,
        {
          status: "success",
          message: "User profile fetched successfully",
          data: {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            phone_number: user.phone_number,
          },
        },
        200
      );
    } catch (error: any) {
      return handleResponse(
        req,
        res,
        { status: "error", message: error.message },
        500
      );
    }
  }
}

export default UserController;
