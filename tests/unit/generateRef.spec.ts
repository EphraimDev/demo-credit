import { expect } from "chai";
import { describe } from "mocha";
import GenerateRef from "../../src/utils/generateRef";

describe("#GenerateRef()", () => {
  context("without argument", async () => {
    it("should return a string of length 20", async () => {
      const ref = GenerateRef();
      
      expect(ref).to.be.a("string");
      expect(ref.length).to.be.eq(20);
    });
  });

  context("with argument", async () => {
    it("should return a string of length 10", async () => {
      const ref = GenerateRef(5);

      expect(ref).to.be.a("string");
      expect(ref.length).to.be.eq(10);
    });
  });
});
