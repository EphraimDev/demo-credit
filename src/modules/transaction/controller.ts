import { Response } from "express";
import { IGetUserAuthInfoRequest } from "../../../types/express";
import { handleResponse } from "../../middlewares";
import generateRef from "../../utils/generateRef";
import AccountService from "../account/service";
import TransactionService from "./service";

class TransactionController {
  static async fundAccount(req: IGetUserAuthInfoRequest, res: Response) {
    const user = req.user;
    if (!user)
      return handleResponse(
        req,
        res,
        { status: "error", message: "Unauthorized" },
        401
      );
    const { amount } = req.body;
    try {
      let find_accounts = await AccountService.findAccounts({
        user_id: user.id,
      });
      if (find_accounts.length === 0)
        return handleResponse(
          req,
          res,
          {
            status: "error",
            message:
              "Account does not exist for this user. Kindly contact customer service",
          },
          404
        );

      await TransactionService.addTransactionToDatabase({
        to_account: find_accounts[0].id,
        amount: parseFloat(amount).toFixed(2),
        type: "FUNDING",
        ref: generateRef(),
      });
      return handleResponse(
        req,
        res,
        {
          status: "success",
          message: "Transaction successfully sent for processing",
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

  static async accountToAccountTransfer(
    req: IGetUserAuthInfoRequest,
    res: Response
  ) {
    const user = req.user;
    if (!user)
      return handleResponse(
        req,
        res,
        { status: "error", message: "Unauthorized" },
        401
      );
    const { amount, receiver } = req.body;
    try {
      const find_debit_account = await AccountService.findAccounts({
        user_id: user.id,
      });
      if (find_debit_account.length === 0)
        return handleResponse(
          req,
          res,
          {
            status: "error",
            message:
              "Account does not exist for this user. Kindly contact customer service",
          },
          404
        );
      const find_credit_account = await AccountService.findAccounts({
        id: receiver,
      });
      if (find_credit_account.length === 0)
        return handleResponse(
          req,
          res,
          {
            status: "error",
            message:
              "Account does not exist for this user. Kindly contact customer service",
          },
          404
        );

      await TransactionService.addTransactionToDatabase({
        from_account: find_debit_account[0].id,
        to_account: find_credit_account[0].id,
        amount: parseFloat(amount).toFixed(2),
        type: "TRANSFER",
        ref: generateRef(),
      });
      return handleResponse(
        req,
        res,
        {
          status: "success",
          message: "Transaction successfully sent for processing",
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

export default TransactionController;
