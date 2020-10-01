import { expect } from "chai";
import { describe } from "mocha";
import { CanDew } from ".";

enum Action {
  A,
  B,
}

type Context = {};

type Target = {};

describe("CanDew", () => {
  it("returns false when no validator is registered", async () => {
    // ARRANGE
    const candew = new CanDew<Action, Context, Target>();

    // ACT
    const result = await candew.can({}, Action.A, {});

    // ASSERT
    expect(result).to.be.false;
  });
});
