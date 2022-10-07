import { Transaction } from "../../database";
import {
  TransactionCreateInterface,
  TransactionWhereInterface,
} from "../../database/types";

class TransactionService {
  static async addTransactionToDatabase(input: TransactionCreateInterface) {
    try {
      return Transaction().insert(input);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  static async findUserTransactions(
    where: TransactionWhereInterface,
    orWhere: TransactionWhereInterface
  ) {
    try {
      return Transaction().where(where).orWhere(orWhere);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  static async findPendingTransactions(where: TransactionWhereInterface) {
    try {
      return Transaction().where(where);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  static async updateTransaction(
    where: TransactionWhereInterface,
    input: TransactionWhereInterface
  ) {
    try {
      return Transaction().where(where).update(input);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

export default TransactionService;