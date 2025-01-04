import {ImageDetect} from "@alt1/base";

export const CAPTURE_INTERVAL_MS = 10000;

export const subImages = ImageDetect.webpackImages({
    statueCollectionBagHeader: require("./statue-collection-bag.data.png"),
    whitePixel: require("./white-pixel.data.png"),
});
