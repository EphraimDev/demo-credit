import { Account } from "../../database";
import { AccountCreateInterface, AccountWhereInterface } from "../../database/types";

class AccountService {
  static async addAccountToDatabase(account: AccountCreateInterface) {
    try {
      return Account().insert(account);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  static async findAccounts(where: AccountWhereInterface) {
    try {
      return Account().where(where);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

export default AccountService;
