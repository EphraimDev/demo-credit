import { expect } from "chai";
import { describe } from "mocha";
import AccessToken from "../../src/utils/accessToken";

describe("#AccessToken()",  () => {
  context("without arguments", () => {
    it("should fail", async () => {
      const token = await AccessToken();
      expect(token).to.be.null;
    });
  });

  context("with empty argument", () => {
    it("should fail", async() => {
      const token = await AccessToken({});
      expect(token).to.be.null;
    });
  });

  context("with arguments", async () => {
    it("should return a string", async () => {
      const token = await AccessToken({id: 1, phone_number: "07000000000"});
      expect(token).to.be.a("string");
    });
  });
});
