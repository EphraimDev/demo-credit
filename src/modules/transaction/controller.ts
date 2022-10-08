import { Response } from "express";
import { IGetUserAuthInfoRequest } from "../../../types/express";
import { AccountInterface } from "../../database/types";
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
    let debit_account: AccountInterface, credit_account: AccountInterface;
    const { amount, receiver } = req.body;
    // validate sending account
    try {
      const find_debit_account: AccountInterface[] =
        await AccountService.findAccounts({
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
      debit_account = find_debit_account[0];
      if (["INACTIVE", "PND"].includes(debit_account.status))
        return handleResponse(
          req,
          res,
          {
            status: "error",
            message:
              "Debit is not allowed on this account. Kindly contact customer service",
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
    // validate receiving account
    try {
      const find_credit_account: AccountInterface[] =
        await AccountService.findAccounts({
          nuban: receiver,
        });
      if (find_credit_account.length === 0)
        return handleResponse(
          req,
          res,
          {
            status: "error",
            message: "Account to be credited does not exist",
          },
          404
        );
      credit_account = find_credit_account[0];
      if (["INACTIVE", "PNC"].includes(credit_account.status))
        return handleResponse(
          req,
          res,
          {
            status: "error",
            message:
              "Credit restriction is placed on the receiving account",
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

    if (debit_account.nuban === credit_account.nuban)
      return handleResponse(
        req,
        res,
        {
          status: "error",
          message: "Invalid transaction",
        },
        400
      );

    if (Number(debit_account.available_balance) < Number(amount))
      return handleResponse(
        req,
        res,
        {
          status: "error",
          message: "Insufficient balance",
        },
        400
      );
    try {
      await TransactionService.addTransactionToDatabase({
        debit_account: debit_account.nuban,
        credit_account: credit_account.nuban,
        amount: parseFloat(amount).toFixed(2),
        ref: generateRef(),
      });
      const new_balance =
        Number(debit_account.available_balance) - Number(amount);
      await AccountService.updateAccount(
        { id: debit_account.id },
        {
          available_balance: Number(
            parseFloat(new_balance.toString()).toFixed(2)
          ),
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
    const { amount } = req.body;
    if (!user)
      return handleResponse(
        req,
        res,
        { status: "error", message: "Unauthorized" },
        401
      );
    let credit_account: AccountInterface, debit_account: AccountInterface;
    //check sending account
    try {
      let find_debit_account: AccountInterface[] =
        await AccountService.findAccounts({
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
      debit_account = find_debit_account[0];
      if (Number(debit_account.available_balance) < Number(amount))
        return handleResponse(
          req,
          res,
          {
            status: "error",
            message: "Insufficient balance",
          },
          400
        );

      if (["INACTIVE", "PND"].includes(debit_account.status))
        return handleResponse(
          req,
          res,
          {
            status: "error",
            message:
              "Debit is not allowed on this account. Kindly contact customer service",
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
    //check receiving account
    try {
      let find_credit_account: AccountInterface[] =
        await AccountService.findAccounts({
          nuban: process.env.SETTLEMENT_ACCOUNT,
        });
      if (find_credit_account.length === 0)
        return handleResponse(
          req,
          res,
          {
            status: "error",
            message: "Settlement account has not been provisioned",
          },
          404
        );
      credit_account = find_credit_account[0];
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
          debit_account: debit_account.nuban,
          credit_account: credit_account.nuban,
          amount: parseFloat(amount).toFixed(2),
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
      const new_balance =
        Number(debit_account.available_balance) - Number(amount);
      await AccountService.updateAccount(
        { id: debit_account.id },
        {
          available_balance: Number(
            parseFloat(new_balance.toString()).toFixed(2)
          ),
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

    return handleResponse(
      req,
      res,
      {
        status: "success",
        message: "Transaction successfully placed for processing",
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
    let debit_account: AccountInterface;
    const { amount } = req.body;
    let credit_account;
    try {
      let find_accounts: AccountInterface[] = await AccountService.findAccounts(
        {
          user_id: user.id,
        }
      );
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
      
      if (["INACTIVE", "PNC"].includes(credit_account.status))
        return handleResponse(
          req,
          res,
          {
            status: "error",
            message: "There is a credit restriction on this account",
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
    try {
      let find_accounts: AccountInterface[] = await AccountService.findAccounts(
        {
          nuban: process.env.SETTLEMENT_ACCOUNT,
        }
      );
      if (find_accounts.length === 0)
        return handleResponse(
          req,
          res,
          {
            status: "error",
            message: "Settlement account has not been provisioned",
          },
          404
        );
      debit_account = find_accounts[0];
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
          credit_account: credit_account.nuban,
          debit_account: debit_account.nuban,
          amount: parseFloat(amount).toFixed(2),
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
      const new_balance =
        Number(debit_account.available_balance) - Number(amount);
      await AccountService.updateAccount(
        { id: debit_account.id },
        {
          available_balance: Number(
            parseFloat(new_balance.toString()).toFixed(2)
          ),
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

    // try {
    //   await TransactionService.updateTransaction(
    //     { id: transactionId },
    //     { status: "COMPLETED" }
    //   );
    // } catch (error) {}

    return handleResponse(
      req,
      res,
      {
        status: "success",
        message: "Transaction successfully placed for processing",
      },
      200
    );
  }
}

export default TransactionController;
