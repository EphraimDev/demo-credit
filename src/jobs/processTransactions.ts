import cron from "node-cron";
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
      let pending_transactions: any[] = [];
      try {
        pending_transactions = await TransactionService.findPendingTransactions(
          {
            status: "PENDING",
            type: "TRANSFER"
          },
        );
      } catch (error: any) {
        console.log(error);
        logger(module).info(
          `PROCESS_TRANSACTIONS JOB error fetching pending transactions - ${error.message}`
        );
      }

      for (let i = 0; i < pending_transactions.length; i++) {
        let credit_account, debit_account, credit_account_new_balance;
        const transaction = pending_transactions[i];
        const amount = Number(transaction.amount);
        try {
          const find_credit_account = await AccountService.findAccounts({
            id: transaction.to_account,
          });
          credit_account = find_credit_account[0];
          credit_account_new_balance =
            Number(credit_account.available_balance) + amount;
        } catch (error: any) {
          logger(module).info(
            `PROCESS_TRANSACTION ${transaction.ref} error finding credit account - ${error.message}`
          );
          continue;
        }

        try {
          const find_debit_account = await AccountService.findAccounts({
            id: transaction.from_account,
          });
          debit_account = find_debit_account[0];
        } catch (error: any) {
          logger(module).info(
            `PROCESS_TRANSACTION ${transaction.ref} error finding debit account - ${error.message}`
          );
          continue;
        }

        try {
          await AccountService.updateAccount(
            { id: credit_account.id },
            {
              available_balance: credit_account_new_balance,
              book_balance: Number(credit_account.book_balance) + amount,
              total_credit: Number(credit_account.total_credit) + amount,
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
          await AccountService.updateAccount(
            { id: debit_account.id },
            {
              book_balance: Number(debit_account.book_balance) - amount,
              total_debit: Number(debit_account.total_debit) + amount,
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
