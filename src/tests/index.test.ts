import { testingReturn } from "..";

describe("index", () => {
  it("tests the return value", () => {
    const testValue = testingReturn();

    expect(testValue).toEqual("teste");
  });
});
