import { Wallet } from "../../database";
import {
  WalletCreateInterface,
  WalletInterface,
  WalletWhereInterface,
} from "../../database/types";

class WalletService {
  static async addWalletToDatabase(
    payload: WalletCreateInterface
  ): Promise<number[] | null> {
    try {
      const wallet = await Wallet().insert(payload);
      return wallet;
    } catch (error: any) {
      return null;
    }
  }

  static async findWallets(
    where: WalletWhereInterface
  ): Promise<WalletInterface[] | null> {
    try {
      const wallet = await Wallet().where(where);
      return wallet;
    } catch (error: any) {
      return null;
    }
  }

  static async updateWallet(
    where: WalletWhereInterface,
    input: WalletWhereInterface
  ): Promise<number | null> {
    try {
      const wallet = await Wallet().where(where).update(input);
      return wallet;
    } catch (error: any) {
      return null;
    }
  }
}

export default WalletService;
