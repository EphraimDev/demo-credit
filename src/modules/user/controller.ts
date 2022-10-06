import { Request, Response } from "express";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { IGetUserAuthInfoRequest } from "../../../types/express";
import { handleResponse } from "../../middlewares";
import UserService from "./service";
import AccessToken from "../../utils/accessToken";
import AccountService from "../account/service";
import {
  AccountCreateInterface,
  AccountWhereInterface,
} from "../../database/types";
import TransactionService from "../transaction/service";

dotenv.config();

class UserController {
  static async signUp(req: Request, res: Response) {
    const { first_name, last_name, password, email, phone_number } = req.body;

    try {
      const findUser = await UserService.findUsers({ email });
      if (findUser.length > 0)
        return handleResponse(
          req,
          res,
          { status: "error", message: "User with this email already exist" },
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

      AccountService.addAccountToDatabase({ user_id: user[0] });

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
    const { password, email } = req.body;

    try {
      const find_user = await UserService.findUsers({ email });
      if (find_user.length === 0)
        return handleResponse(
          req,
          res,
          { status: "error", message: "User with this email does not exist" },
          400
        );
      const user = find_user[0];

      const is_password_correct = bcrypt.compareSync(
        password.trim(),
        user.password
      );
      if (!is_password_correct)
        return handleResponse(
          req,
          res,
          { status: "error", message: "Email or password is incorrect" },
          401
        );

      const token = await AccessToken({ id: user.id, email: user.email });
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
          message: "User created successfully",
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
      const accounts = await AccountService.findAccounts({ user_id: user.id });
      const account: AccountWhereInterface = {
        available_balance: 0,
        book_balance: 0,
        total_credit: 0,
        total_debit: 0,
      };
      if (accounts.length === 0) {
        const response = await AccountService.addAccountToDatabase({
          user_id: user.id,
        });
        account.id = response[0];
      } else {
        account.available_balance = accounts[0].available_balance;
        account.book_balance = accounts[0].book_balance;
        account.total_credit = accounts[0].total_credit;
        account.total_debit = accounts[0].total_debit;
        account.id = accounts[0].id;
      }
      const transactions = await TransactionService.findUserTransactions(
        { from_account: account.id },
        { to_account: account.id }
      );
      return handleResponse(
        req,
        res,
        {
          status: "success",
          message: "User created successfully",
          data: {
            user: {
              id: user.id,
              email: user.email,
              first_name: user.first_name,
              last_name: user.last_name,
              phone_number: user.phone_number,
            },
            account,
            transactions,
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
