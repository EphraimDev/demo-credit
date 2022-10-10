import { expect } from "chai";
import { describe } from "mocha";
import UserService from "../../src/modules/user/service";

describe("#addUserToDatabase()", () => {
  context("without argument", async () => {
    it("should return null", async () => {
      const res = await UserService.addUserToDatabase();
      expect(res).to.be.null;
    });
  });

  context("with argument", async () => {
    it("should return an array", async () => {
      const res = await UserService.addUserToDatabase({
        first_name: "first",
        last_name: "last",
        email: "email@demo-credit.com",
        phone_number: "097000000",
        password: "",
      });

      expect(res).to.be.an("array");
    });
  });
});

describe("#findUsers()", () => {
  context("without argument", async () => {
    it("should return null", async () => {
      const res = await UserService.findUsers();
      expect(res).to.be.null;
    });
  });

  context("with argument", async () => {
    it("should return an array", async () => {
      const res = await UserService.findUsers({
        phone_number: "097000000",
      });

      expect(res).to.be.an("array");
    });
  });
});

describe("#updateUser()", () => {
  context("without argument", async () => {
    it("should return null", async () => {
      const res = await UserService.updateUser();
      expect(res).to.be.null;
    });
  });

  context("with argument", async () => {
    it("should return an array", async () => {
      const res = await UserService.updateUser(
        {
          phone_number: "097000000",
        },
        { email: "user@demo-credit.com" }
      );

      expect(res).to.be.a("number");
    });
  });
});
