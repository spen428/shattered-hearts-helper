import StatueCollectionBagImageProcessor from "../util/StatueCollectionBagImageProcessor";
import Logger from "../util/Logger";
import { bagState, RockBag } from "../util/StatueCollectionBag";
import { ImageDetect, ImgRefData } from "alt1";

const testImages = ImageDetect.webpackImages({
  strangeRocksEmpty: require("../tests/res/strange-empty.data.png"),
  strangeRocksPartial: require("../tests/res/strange-farming-smithing.data.png"),
  goldenRocksEmpty: require("../tests/res/golden-empty.data.png"),
  goldenRocksPartial: require("../tests/res/golden-crafting-2melee-2prayer.data.png"),
  strangeRocksMiningSecondOnly: require("./res/strange-mining-2nd-only.data.png"),
  chatRockGained: require("./res/agig.data.png"),
  chatRockGained2: require("../tests/res/agis.data.png"),
  chatRockGained3: require("../tests/res/agis2.data.png"),
});

function assert(bool: boolean, msg: string) {
  if (!bool) {
    Logger.writeError("Assertion failed: " + msg);
    throw new Error("Assertion failed: " + msg);
  }
}

function assertEmpty(rocks: RockBag) {
  assertRockCount(rocks, 0);
}

function assertRockCount(rocks: RockBag, expected: number) {
  const rockCount = Object.keys(rocks).reduce((accumulator, key) => {
    return (
      accumulator + (rocks[key].first ? 1 : 0) + (rocks[key].second ? 1 : 0)
    );
  }, 0);
  assert(
    rockCount === expected,
    `Bag contained ${rockCount} rocks, expected ${expected}`,
  );
}

function runTests() {
  assertEmpty(bagState.strangeRocks);
  assertEmpty(bagState.goldenRocks);

  StatueCollectionBagImageProcessor.processScreenshot(
    new ImgRefData(testImages.strangeRocksEmpty),
  );
  assertEmpty(bagState.strangeRocks);
  assertEmpty(bagState.goldenRocks);

  StatueCollectionBagImageProcessor.processScreenshot(
    new ImgRefData(testImages.strangeRocksPartial),
  );
  assertRockCount(bagState.strangeRocks, 2);
  assert(bagState.strangeRocks.Farming.first, "Expected 1st farming rock");
  assert(bagState.strangeRocks.Smithing.first, "Expected 1st smithing rock");
  assertEmpty(bagState.goldenRocks);

  StatueCollectionBagImageProcessor.processScreenshot(
    new ImgRefData(testImages.goldenRocksPartial),
  );
  assertRockCount(bagState.strangeRocks, 2);
  assertRockCount(bagState.goldenRocks, 5);
  assert(
    bagState.goldenRocks.Crafting.first,
    "Expected 1st golden crafting rock",
  );
  assert(bagState.goldenRocks.Melee.first, "Expected 1st melee rock");
  assert(bagState.goldenRocks.Melee.second, "Expected 2nd melee rock");
  assert(bagState.goldenRocks.Prayer.first, "Expected 1st prayer rock");
  assert(bagState.goldenRocks.Prayer.second, "Expected 2nd prayer rock");

  StatueCollectionBagImageProcessor.processScreenshot(
    new ImgRefData(testImages.goldenRocksEmpty),
  );
  assertRockCount(bagState.strangeRocks, 2);
  assertEmpty(bagState.goldenRocks);

  StatueCollectionBagImageProcessor.processScreenshot(
    new ImgRefData(testImages.strangeRocksEmpty),
  );
  assertEmpty(bagState.strangeRocks);
  assertEmpty(bagState.goldenRocks);

  StatueCollectionBagImageProcessor.processScreenshot(
    new ImgRefData(testImages.strangeRocksMiningSecondOnly),
  );
  assertRockCount(bagState.strangeRocks, 1);
  assert(
    bagState.strangeRocks.Mining.second,
    "Expected only second mining rock",
  );
  assertEmpty(bagState.goldenRocks);

  StatueCollectionBagImageProcessor.processScreenshot(
    new ImgRefData(testImages.strangeRocksEmpty),
  );
  assertEmpty(bagState.strangeRocks);
  assertEmpty(bagState.goldenRocks);

  StatueCollectionBagImageProcessor.processScreenshot(
    new ImgRefData(testImages.chatRockGained),
  );
  assertEmpty(bagState.strangeRocks);
  assertRockCount(bagState.goldenRocks, 2);
  assert(
    bagState.goldenRocks.Agility.first,
    "Expected 1st golden agility rock",
  );
  assert(
    bagState.goldenRocks.Agility.second,
    "Expected 2nd golden agility rock",
  );

  StatueCollectionBagImageProcessor.processScreenshot(
    new ImgRefData(testImages.chatRockGained2),
  );
  assertRockCount(bagState.strangeRocks, 1);
  assert(bagState.goldenRocks.Agility.first, "Expected 1st agility rock");
  assertRockCount(bagState.goldenRocks, 2);
  assert(
    bagState.goldenRocks.Agility.first,
    "Expected 1st golden agility rock",
  );
  assert(
    bagState.goldenRocks.Agility.second,
    "Expected 2nd golden agility rock",
  );

  StatueCollectionBagImageProcessor.processScreenshot(
    new ImgRefData(testImages.chatRockGained3),
  );
  assertRockCount(bagState.strangeRocks, 2);
  assert(bagState.strangeRocks.Agility.first, "Expected 1st agility rock");
  assert(bagState.strangeRocks.Agility.second, "Expected 2nd agility rock");
  assertRockCount(bagState.goldenRocks, 2);
  assert(
    bagState.goldenRocks.Agility.first,
    "Expected 1st golden agility rock",
  );
  assert(
    bagState.goldenRocks.Agility.second,
    "Expected 2nd golden agility rock",
  );
}

testImages.promise.then(() => {
  runTests();
  Logger.writeLog("All tests passed!");
});
