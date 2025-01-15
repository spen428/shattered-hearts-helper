import StatueCollectionBagImageProcessor from "../util/StatueCollectionBagImageProcessor";
import Logger from "../util/Logger";
import { bagState, RockBag } from "../util/StatueCollectionBag";
import { ImageDetect, ImgRefData } from "alt1";

const testImages = ImageDetect.webpackImages({
  strangeRocksEmpty: require("./res/strange-empty.data.png"),
  strangeRocksPartial: require("./res/strange-farming-smithing.data.png"),
  goldenRocksEmpty: require("./res/golden-empty.data.png"),
  goldenRocksPartial: require("./res/golden-crafting-2melee-2prayer.data.png"),
  strangeRocksMiningSecondOnly: require("./res/strange-mining-2nd-only.data.png"),
  chatRockGained: require("./res/agig.data.png"),
  chatRockGained2: require("./res/agis.data.png"),
  goldenSummoningGained: require("./res/golden-summoning-gained.data.png"),
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
  const strangeRocks = bagState.strangeRocks;
  const goldenRocks = bagState.goldenRocks;

  assertEmpty(strangeRocks);
  assertEmpty(goldenRocks);

  StatueCollectionBagImageProcessor.processScreenshot(
    new ImgRefData(testImages.strangeRocksEmpty),
  );
  assertEmpty(strangeRocks);
  assertEmpty(goldenRocks);

  StatueCollectionBagImageProcessor.processScreenshot(
    new ImgRefData(testImages.strangeRocksPartial),
  );
  assertRockCount(strangeRocks, 2);
  assert(strangeRocks.Farming.first, "Expected 1st farming rock");
  assert(strangeRocks.Smithing.first, "Expected 1st smithing rock");
  assertEmpty(goldenRocks);

  StatueCollectionBagImageProcessor.processScreenshot(
    new ImgRefData(testImages.goldenRocksPartial),
  );
  assertRockCount(strangeRocks, 2);
  assertRockCount(goldenRocks, 5);
  assert(goldenRocks.Crafting.first, "Expected 1st golden crafting rock");
  assert(goldenRocks.Melee.first, "Expected 1st melee rock");
  assert(goldenRocks.Melee.second, "Expected 2nd melee rock");
  assert(goldenRocks.Prayer.first, "Expected 1st prayer rock");
  assert(goldenRocks.Prayer.second, "Expected 2nd prayer rock");

  StatueCollectionBagImageProcessor.processScreenshot(
    new ImgRefData(testImages.goldenRocksEmpty),
  );
  assertRockCount(strangeRocks, 2);
  assertEmpty(goldenRocks);

  StatueCollectionBagImageProcessor.processScreenshot(
    new ImgRefData(testImages.strangeRocksEmpty),
  );
  assertEmpty(strangeRocks);
  assertEmpty(goldenRocks);

  StatueCollectionBagImageProcessor.processScreenshot(
    new ImgRefData(testImages.strangeRocksMiningSecondOnly),
  );
  assertRockCount(strangeRocks, 1);
  assert(strangeRocks.Mining.second, "Expected only second mining rock");
  assertEmpty(goldenRocks);

  StatueCollectionBagImageProcessor.processScreenshot(
    new ImgRefData(testImages.strangeRocksEmpty),
  );
  assertEmpty(strangeRocks);
  assertEmpty(goldenRocks);

  StatueCollectionBagImageProcessor.processScreenshot(
    new ImgRefData(testImages.chatRockGained),
  );
  assertEmpty(strangeRocks);
  assertRockCount(goldenRocks, 2);
  assert(goldenRocks.Agility.first, "Expected 1st golden agility rock");
  assert(goldenRocks.Agility.second, "Expected 2nd golden agility rock");

  StatueCollectionBagImageProcessor.processScreenshot(
    new ImgRefData(testImages.chatRockGained2),
  );
  assertRockCount(strangeRocks, 1);
  assert(goldenRocks.Agility.first, "Expected 1st agility rock");
  assertRockCount(goldenRocks, 2);
  assert(goldenRocks.Agility.first, "Expected 1st golden agility rock");
  assert(goldenRocks.Agility.second, "Expected 2nd golden agility rock");

  StatueCollectionBagImageProcessor.processScreenshot(
    new ImgRefData(testImages.goldenSummoningGained),
  );
  assert(goldenRocks.Summoning.first, "Expected 1st summoning rock");
}

testImages.promise.then(() => {
  runTests();
  Logger.writeLog("All tests passed!");
});
