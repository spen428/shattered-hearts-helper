import {ImageDetect, ImgRefData} from "@alt1/base";
import StatueCollectionBagImageProcessor from "../util/StatueCollectionBagImageProcessor";
import Logger from "../util/Logger";
import {bagState, RockBag} from "../util/StatueCollectionBag";

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
        return accumulator + (rocks[key].first ? 1 : 0) + (rocks[key].second ? 1 : 0);
    }, 0);
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
    assert(bagState.strangeRocks.farming.first, "Expected 1st farming rock");
    assert(bagState.strangeRocks.smithing.first, "Expected 1st smithing rock");
    assertEmpty(bagState.goldenRocks);

    StatueCollectionBagImageProcessor.processScreenshot(new ImgRefData(testImages.goldenRocksPartial));
    assertRockCount(bagState.strangeRocks, 2);
    assertRockCount(bagState.goldenRocks, 5);
    assert(bagState.goldenRocks.crafting.first, "Expected 1st golden crafting rock");
    assert(bagState.goldenRocks.melee.first, "Expected 1st melee rocks");
    assert(bagState.goldenRocks.melee.second, "Expected 2nd melee rocks");
    assert(bagState.goldenRocks.prayer.first, "Expected 1st prayer rocks");
    assert(bagState.goldenRocks.prayer.second, "Expected 2nd prayer rocks");

    StatueCollectionBagImageProcessor.processScreenshot(new ImgRefData(testImages.goldenRocksEmpty));
    assertRockCount(bagState.strangeRocks, 2);
    assertEmpty(bagState.goldenRocks);

    StatueCollectionBagImageProcessor.processScreenshot(new ImgRefData(testImages.strangeRocksEmpty));
    assertEmpty(bagState.strangeRocks);
    assertEmpty(bagState.goldenRocks);

    StatueCollectionBagImageProcessor.processScreenshot(new ImgRefData(testImages.strangeRocksMiningSecondOnly));
    assertRockCount(bagState.strangeRocks, 1);
    assert(bagState.strangeRocks.mining.second, "Expected only second mining rock");
    assertEmpty(bagState.goldenRocks);

    StatueCollectionBagImageProcessor.processScreenshot(new ImgRefData(testImages.strangeRocksEmpty));
    assertEmpty(bagState.strangeRocks);
    assertEmpty(bagState.goldenRocks);

    StatueCollectionBagImageProcessor.processScreenshot(new ImgRefData(testImages.chatRockGained));
    assertEmpty(bagState.strangeRocks);
    assertRockCount(bagState.goldenRocks, 2);
    assert(bagState.goldenRocks.agility.first, "Expected 1st golden agility rocks");
    assert(bagState.goldenRocks.agility.second, "Expected 2nd golden agility rocks");

    StatueCollectionBagImageProcessor.processScreenshot(new ImgRefData(testImages.chatRockGained2));
    assertRockCount(bagState.strangeRocks, 1);
    assert(bagState.goldenRocks.agility.first, "Expected 1st agility rock");
    assertRockCount(bagState.goldenRocks, 2);
    assert(bagState.goldenRocks.agility.first, "Expected 1st golden agility rocks");
    assert(bagState.goldenRocks.agility.second, "Expected 2nd golden agility rocks");

    StatueCollectionBagImageProcessor.processScreenshot(new ImgRefData(testImages.chatRockGained3));
    assertRockCount(bagState.strangeRocks, 2);
    assert(bagState.strangeRocks.agility.first, "Expected 1st agility rocks");
    assert(bagState.strangeRocks.agility.second, "Expected 2nd agility rocks");
    assertRockCount(bagState.goldenRocks, 2);
    assert(bagState.goldenRocks.agility.first, "Expected 1st golden agility rocks");
    assert(bagState.goldenRocks.agility.second, "Expected 2nd golden agility rocks");
}

testImages.promise.then(() => {
    runTests();
    Logger.writeLog("All tests passed!");
});
