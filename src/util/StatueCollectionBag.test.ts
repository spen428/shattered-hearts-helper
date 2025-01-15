import StatueCollectionBag from "./StatueCollectionBag";

describe("enumerate()", () => {
  test("Returns 62 distinct rocks", () => {
    let rocks = StatueCollectionBag.enumerate();
    expect(rocks.length).toBe(62);
    expect(new Set(rocks).size).toBe(62);
  });
});
