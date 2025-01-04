import {ImageDetect, ImgRefData} from "@alt1/base";
import StatueCollectionBagImageProcessor, {bagState, RockBag} from "../util/StatueCollectionBagImageProcessor";

const testImages = ImageDetect.webpackImages({
    strangeRocksEmpty: require("../tests/res/strange-empty.data.png"),
    strangeRocksPartial: require("../tests/res/strange-farming-smithing.data.png"),
    goldenRocksEmpty: require("../tests/res/golden-empty.data.png"),
    goldenRocksPartial: require("../tests/res/golden-crafting-2melee-2prayer.data.png"),
});

function assert(bool: boolean, msg: string) {
    if (!bool) {
        throw new Error("Assertion failed: " + msg);
    }
}

function assertEmpty(rocks: RockBag) {
    assertRockCount(rocks, 0);
}

function assertRockCount(rocks: RockBag, expected: number) {
    const rockCount = Object.keys(rocks).reduce((acc, key) => acc + rocks[key], 0);
    assert(rockCount === expected, `Bag contained ${rockCount} rocks, expected ${expected}`);
}

function runTests() {
    assertEmpty(bagState.strangeRocks);
    assertEmpty(bagState.goldenRocks);

    StatueCollectionBagImageProcessor.processScreenshot(new ImgRefData(testImages.strangeRocksEmpty));
    assertEmpty(bagState.strangeRocks);
    assertEmpty(bagState.goldenRocks);

    StatueCollectionBagImageProcessor.processScreenshot(new ImgRefData(testImages.strangeRocksPartial));
    assertRockCount(bagState.strangeRocks, 2);
    assert(bagState.strangeRocks.farming === 1, "Expected 1 farming rock");
    assert(bagState.strangeRocks.smithing === 1, "Expected 1 smithing rock");
    assertEmpty(bagState.goldenRocks);

    StatueCollectionBagImageProcessor.processScreenshot(new ImgRefData(testImages.goldenRocksPartial));
    assertRockCount(bagState.strangeRocks, 2);
    assertRockCount(bagState.goldenRocks, 5);
    assert(bagState.goldenRocks.crafting === 1, "Expected 1 golden crafting rock");
    assert(bagState.goldenRocks.melee === 2, "Expected 2 melee rocks");
    assert(bagState.goldenRocks.prayer === 2, "Expected 2 prayer rocks");

    StatueCollectionBagImageProcessor.processScreenshot(new ImgRefData(testImages.goldenRocksEmpty));
    assertRockCount(bagState.strangeRocks, 2);
    assertEmpty(bagState.goldenRocks);

    StatueCollectionBagImageProcessor.processScreenshot(new ImgRefData(testImages.strangeRocksEmpty));
    assertEmpty(bagState.strangeRocks);
    assertEmpty(bagState.goldenRocks);
}

testImages.promise.then(() => runTests());
