import { Transaction } from "../../database";
import {
  TransactionCreateInterface,
  TransactionInterface,
  TransactionWhereInterface,
} from "../../database/types";

class TransactionService {
  static async addTransactionToDatabase(
    input: TransactionCreateInterface
  ): Promise<number[] | null> {
    try {
      const transaction = await Transaction().insert(input);
      return transaction;
    } catch (error: any) {
      return null;
    }
  }

  static async findUserTransactions(
    where: TransactionWhereInterface,
    orWhere: TransactionWhereInterface
  ): Promise<TransactionInterface[] | null> {
    try {
      const transactions = await Transaction().where(where).orWhere(orWhere);
      return transactions;
    } catch (error: any) {
      return null;
    }
  }

  static async findPendingTransactions(
    where: TransactionWhereInterface
  ): Promise<TransactionInterface[] | null> {
    try {
      const transactions = await Transaction().where(where);
      return transactions;
    } catch (error: any) {
      return null;
    }
  }

  static async updateTransaction(
    where: TransactionWhereInterface,
    input: TransactionWhereInterface
  ) {
    try {
      const transaction = await Transaction().where(where).update(input);
      return transaction;
    } catch (error: any) {
      return null;
    }
  }
}

export default TransactionService;
