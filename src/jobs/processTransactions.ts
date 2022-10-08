import cron from "node-cron";
import { AccountInterface, TransactionInterface } from "../database/types";
import AccountService from "../modules/account/service";
import TransactionService from "../modules/transaction/service";
import logger from "../utils/logger";

const PROCESS_TRANSACTIONS_JOB_TIMER =
  process.env.PROCESS_TRANSACTIONS_JOB_TIMER;
export default async () => {
  cron
    .schedule(PROCESS_TRANSACTIONS_JOB_TIMER || "", async () => {
      logger(module).info(
        `PROCESS_TRANSACTIONS_JOB starts at ${Date().toString()}`
      );
      let pending_transactions: TransactionInterface[] = [];
      try {
        pending_transactions = await TransactionService.findPendingTransactions(
          {
            status: "PENDING",
          }
        );
      } catch (error: any) {
        console.log(error);
        logger(module).info(
          `PROCESS_TRANSACTIONS JOB error fetching pending transactions - ${error.message}`
        );
      }

      for (let i = 0; i < pending_transactions.length; i++) {
        let credit_account: AccountInterface, debit_account: AccountInterface;
        const transaction = pending_transactions[i];
        try {
          const find_credit_account: AccountInterface[] =
            await AccountService.findAccounts({
              nuban: transaction.credit_account,
            });
          credit_account = find_credit_account[0];
        } catch (error: any) {
          logger(module).info(
            `PROCESS_TRANSACTION ${transaction.ref} error finding credit account - ${error.message}`
          );
          continue;
        }

        try {
          const find_debit_account: AccountInterface[] =
            await AccountService.findAccounts({
              nuban: transaction.debit_account,
            });
          debit_account = find_debit_account[0];
        } catch (error: any) {
          logger(module).info(
            `PROCESS_TRANSACTION ${transaction.ref} error finding debit account - ${error.message}`
          );
          continue;
        }

        try {
          const new_balance =
            Number(credit_account.available_balance) +
            Number(transaction.amount);
          const new_book_balance =
            Number(credit_account.book_balance) + Number(transaction.amount);
          await AccountService.updateAccount(
            { nuban: credit_account.nuban },
            {
              available_balance: Number(
                parseFloat(new_balance.toString()).toFixed(2)
              ),
              book_balance: Number(
                parseFloat(new_book_balance.toString()).toFixed(2)
              ),
            }
          );
          logger(module).info(
            `PROCESS_TRANSACTION ${transaction.ref} credit account - success`
          );
          await TransactionService.updateTransaction(
            { id: transaction.id },
            {
              status: "COMPLETED",
            }
          );
        } catch (error: any) {
          logger(module).info(
            `PROCESS_TRANSACTION ${transaction.ref} error crediting account - ${error.message}`
          );
          TransactionService.updateTransaction(
            { id: transaction.id },
            {
              status: "FAILED",
            }
          );
        }

        try {
          const new_book_balance =
            Number(debit_account.book_balance) - Number(transaction.amount);
          await AccountService.updateAccount(
            { nuban: debit_account.nuban },
            {
              book_balance: Number(
                parseFloat(new_book_balance.toString()).toFixed(2)
              ),
            }
          );
          logger(module).info(
            `PROCESS_TRANSACTION ${transaction.ref} debit account - success`
          );
        } catch (error: any) {
          logger(module).info(
            `PROCESS_TRANSACTION ${transaction.ref} error debiting account - ${error.message}`
          );
          continue;
        }
      }

      logger(module).info(
        `PROCESS_TRANSACTIONS_JOB ends at ${Date().toString()}`
      );
      return;
    })
    .start();
};
