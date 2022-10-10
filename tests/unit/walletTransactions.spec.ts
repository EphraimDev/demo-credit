import { expect } from "chai";
import { describe } from "mocha";
import WalletService from "../../src/modules/transaction/service";
import generateRef from "../../src/utils/generateRef";

describe("#addTransactionToDatabase()", () => {
  context("without argument", async () => {
    it("should return null", async () => {
      const res = await WalletService.addTransactionToDatabase();
      expect(res).to.be.null;
    });
  });

  context("with argument", async () => {
    it("should return an array", async () => {
      const res = await WalletService.addTransactionToDatabase({
        debit_account: process.env.SETTLEMENT_ACCOUNT || "0000000001",
        credit_account: "097000000",
        amount: "35000",
        ref: generateRef(5),
      });

      expect(res).to.be.an("array");
    });
  });
});

describe("#findUserTransactions()", () => {
  context("without argument", async () => {
    it("should return null", async () => {
      const res = await WalletService.findUserTransactions();
      expect(res).to.be.null;
    });
  });

  context("with argument", async () => {
    it("should return an array", async () => {
      const res = await WalletService.findUserTransactions(
        { debit_account: "097000000" },
        { credit_account: "097000000" }
      );

      expect(res).to.be.an("array");
    });
  });
});

describe("#findPendingTransactions()", () => {
  context("without argument", async () => {
    it("should return null", async () => {
      const res = await WalletService.findPendingTransactions();
      expect(res).to.be.null;
    });
  });

  context("with argument", async () => {
    it("should return an array", async () => {
      const res = await WalletService.findPendingTransactions({
        debit_account: "097000000",
      });

      expect(res).to.be.an("array");
    });
  });
});

describe("#updateTransaction()", () => {
  context("without argument", async () => {
    it("should return null", async () => {
      const res = await WalletService.updateTransaction();
      expect(res).to.be.null;
    });
  });

  context("with argument", async () => {
    it("should return an array", async () => {
      const res = await WalletService.updateTransaction(
        { id: 1 },
        {
          status: "COMPLETED",
        }
      );

      expect(res).to.be.a("number");
    });
  });
});
