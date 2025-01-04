import {ImageDetect} from "@alt1/base";

export const CAPTURE_INTERVAL_MS = 10000;

export const subImages = ImageDetect.webpackImages({
    statueCollectionBagHeader: require("./res/statue-collection-bag.data.png"),
    whitePixel: require("./res/white-pixel.data.png"),
    strangeRocksTabSelected: require("./res/strange-tab.data.png"),
    goldenRocksTabSelected: require("./res/golden-tab.data.png"),
});
