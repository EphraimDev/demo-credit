import cron from "node-cron";
import { WalletInterface, TransactionInterface } from "../database/types";
import WalletService from "../modules/wallet/service";
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
        let credit_account: WalletInterface, debit_account: WalletInterface;
        const transaction = pending_transactions[i];
        try {
          const find_credit_account = await WalletService.findWallets({
            nuban: transaction.credit_account,
          });
          if (!find_credit_account) {
            logger(module).info(
              `PROCESS_TRANSACTION ${transaction.ref} error finding credit account`
            );
            continue;
          }
          credit_account = find_credit_account[0];
        } catch (error: any) {
          logger(module).info(
            `PROCESS_TRANSACTION ${transaction.ref} error finding credit account - ${error.message}`
          );
          continue;
        }

        try {
          const find_debit_account = await WalletService.findWallets({
            nuban: transaction.debit_account,
          });
          if (!find_debit_account) {
            logger(module).info(
              `PROCESS_TRANSACTION ${transaction.ref} error finding debit account`
            );
            continue;
          }
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
          await WalletService.updateWallet(
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
          await WalletService.updateWallet(
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
    .stop();
};
