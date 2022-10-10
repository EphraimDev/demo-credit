import { expect } from "chai";
import { describe } from "mocha";
import WalletService from "../../src/modules/wallet/service";

describe("#addWalletToDatabase()", () => {
  context("without argument", async () => {
    it("should return null", async () => {
      const res = await WalletService.addWalletToDatabase();
      expect(res).to.be.null;
    });
  });

  context("with argument", async () => {
    it("should return an array", async () => {
      const res = await WalletService.addWalletToDatabase({
        user_id: 1,
        nuban: "097000000",
      });

      expect(res).to.be.an("array");
    });
  });
});

describe("#findWallets()", () => {
  context("without argument", async () => {
    it("should return null", async () => {
      const res = await WalletService.findWallets();
      expect(res).to.be.null;
    });
  });

  context("with argument", async () => {
    it("should return an array", async () => {
      const res = await WalletService.findWallets({});

      expect(res).to.be.an("array");
    });
  });
});

describe("#updateWallet()", () => {
  context("without argument", async () => {
    it("should return null", async () => {
      const res = await WalletService.updateWallet();
      expect(res).to.be.null;
    });
  });

  context("with argument", async () => {
    it("should return an array", async () => {
      const res = await WalletService.updateWallet(
        {
          nuban: "097000000",
        },
        { available_balance: 2000.1, book_balance: 2000.1 }
      );

      expect(res).to.be.a("number");
    });
  });
});
