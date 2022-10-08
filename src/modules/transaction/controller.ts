import { Response } from "express";
import { IGetUserAuthInfoRequest } from "../../../types/express";
import { handleResponse } from "../../middlewares";
import generateRef from "../../utils/generateRef";
import AccountService from "../account/service";
import TransactionService from "./service";

class TransactionController {
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

      if (Number(find_debit_account[0].available_balance) < amount)
        return handleResponse(
          req,
          res,
          {
            status: "error",
            message: "Insufficient balance",
          },
          400
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
              "Account does not exist for the intending receiver. Kindly contact customer service",
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
      await AccountService.updateAccount(
        { id: find_debit_account[0].id },
        {
          available_balance:
            Number(find_debit_account[0].available_balance) - Number(amount),
        }
      );
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

  static async accountWithdrawal(req: IGetUserAuthInfoRequest, res: Response) {
    const user = req.user;
    if (!user)
      return handleResponse(
        req,
        res,
        { status: "error", message: "Unauthorized" },
        401
      );
    const { amount } = req.body;
    let debit_account;
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
      debit_account = find_accounts[0];
      if (Number(debit_account.available_balance) < amount)
        return handleResponse(
          req,
          res,
          {
            status: "error",
            message: "Insufficient balance",
          },
          400
        );
    } catch (error: any) {
      return handleResponse(
        req,
        res,
        { status: "error", message: error.message },
        500
      );
    }
    let transactionId;
    try {
      const store_transaction =
        await TransactionService.addTransactionToDatabase({
          from_account: debit_account.id,
          amount: parseFloat(amount).toFixed(2),
          type: "WITHDRAWAL",
          ref: generateRef(),
        });
      transactionId = store_transaction[0];
    } catch (error: any) {
      return handleResponse(
        req,
        res,
        { status: "error", message: error.message },
        500
      );
    }

    try {
      await AccountService.updateAccount(
        { id: debit_account.id },
        {
          available_balance:
            Number(debit_account.available_balance) - Number(amount),
          book_balance: Number(debit_account.book_balance) - Number(amount),
          total_debit: Number(debit_account.total_debit) + Number(amount),
        }
      );
    } catch (error: any) {
      await TransactionService.updateTransaction(
        { id: transactionId },
        { status: "FAILED", comment: error.message }
      );
      return handleResponse(
        req,
        res,
        { status: "error", message: error.message },
        500
      );
    }

    try {
      await TransactionService.updateTransaction(
        { id: transactionId },
        { status: "COMPLETED" }
      );
    } catch (error) {}

    return handleResponse(
      req,
      res,
      {
        status: "success",
        message: "Transaction successful",
      },
      200
    );
  }

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
    let credit_account;
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
      credit_account = find_accounts[0];
    } catch (error: any) {
      return handleResponse(
        req,
        res,
        { status: "error", message: error.message },
        500
      );
    }
    let transactionId;
    try {
      const store_transaction =
        await TransactionService.addTransactionToDatabase({
          to_account: credit_account.id,
          amount: parseFloat(amount).toFixed(2),
          type: "FUNDING",
          ref: generateRef(),
        });
      transactionId = store_transaction[0];
    } catch (error: any) {
      return handleResponse(
        req,
        res,
        { status: "error", message: error.message },
        500
      );
    }

    try {
      await AccountService.updateAccount(
        { id: credit_account.id },
        {
          available_balance:
            Number(credit_account.available_balance) + Number(amount),
          book_balance: Number(credit_account.book_balance) + Number(amount),
          total_credit: Number(credit_account.total_credit) + Number(amount),
        }
      );
    } catch (error: any) {
      await TransactionService.updateTransaction(
        { id: transactionId },
        { status: "FAILED", comment: error.message }
      );
      return handleResponse(
        req,
        res,
        { status: "error", message: error.message },
        500
      );
    }

    try {
      await TransactionService.updateTransaction(
        { id: transactionId },
        { status: "COMPLETED" }
      );
    } catch (error) {}

    return handleResponse(
      req,
      res,
      {
        status: "success",
        message: "Transaction successful",
      },
      200
    );
  }
}

export default TransactionController;
