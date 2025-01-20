import { ImageDetect } from "alt1";

export const CAPTURE_INTERVAL_MS = 2000;

export const subImages = ImageDetect.webpackImages({
  statueCollectionBagHeader: require("./res/statue-collection-bag.data.png"),
  strangeRocksTabSelected: require("./res/strange-tab.data.png"),
  goldenRocksTabSelected: require("./res/golden-tab.data.png"),
});
