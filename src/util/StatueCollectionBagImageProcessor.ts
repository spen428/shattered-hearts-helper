import {ImgRef, mixColor} from "@alt1/base";
import Logger from "./Logger";
import {CAPTURE_INTERVAL_MS, subImages} from "../config";
import ChatBoxProcessor from "./ChatBoxProcessor";
import {bagState, RockBag} from "./StatueCollectionBag";

class StatueCollectionBagImageProcessor {
    public processScreenshot(img: ImgRef) {
        this.processChatBox(img);
        this.processStatueCollectionBagUi(img);
    }

    private processChatBox(img: ImgRef) {
        const lines = ChatBoxProcessor.getChatLines(img);
        lines.forEach(line => Logger.writeLog(line));
    }

    private processStatueCollectionBagUi(img: ImgRef) {
        const match = img.findSubimage(subImages.statueCollectionBagHeader)[0];
        if (!match) {
            return;
        }

        Logger.writeLog("The Statue Collection Bag UI is open");

        let rockBag: RockBag = bagState.strangeRocks;
        if (!!img.findSubimage(subImages.goldenRocksTabSelected)[0]) {
            rockBag = bagState.goldenRocks;
            Logger.writeLog("Golden rocks tab is open");
        } else {
            Logger.writeLog("Strange rocks tab is open");
        }

        let boxY = match.y + 55;
        let boxX = match.x;

        const rockBoundingBoxes = this.getRockBoundingBoxes(rockBag, boxX, boxY);

        for (const boundingBox of rockBoundingBoxes) {
            let imageData = img.toData(boundingBox.x, boundingBox.y, boundingBox.width, boundingBox.height);
            rockBag[boundingBox.skill][boundingBox.rockOrdinal] = this.containsWhitePixel(imageData);
        }

        if (window.alt1) {
            alt1.overLayRect(mixColor(255, 255, 255), boxX, boxY, 485, 270, CAPTURE_INTERVAL_MS, 2);

            for (const boundingBox of rockBoundingBoxes) {
                let rockIsPresent = rockBag[boundingBox.skill][boundingBox.rockOrdinal];
                let color = rockIsPresent ? mixColor(0, 255, 0) : mixColor(0, 0, 255);
                alt1.overLayRect(color, boundingBox.x, boundingBox.y, boundingBox.width, boundingBox.height, CAPTURE_INTERVAL_MS, 1);
            }

            for (const boundingBox of rockBoundingBoxes.filter(x => x.rockOrdinal === "first")) {
                let rockCount = (rockBag[boundingBox.skill].first ? 1 : 0) + (rockBag[boundingBox.skill].second ? 1 : 0);
                let statusText = `${rockCount}/2`;
                alt1.overLayText(statusText, mixColor(255, 200, 0), 10, boundingBox.x + 74, boundingBox.y + 4, CAPTURE_INTERVAL_MS);
            }
        }
    }

    private getRockBoundingBoxes(rocks: RockBag, boxX: number, boxY: number) {
        const boundingBoxes: {
            skill: string,
            rockOrdinal: 'first' | "second",
            x: number,
            y: number,
            width: number,
            height: number
        }[] = [];

        const keys = Object.keys(rocks);

        for (let i = 0; i < keys.length; i++) {
            let x = boxX + 134;
            let offset = i % 8;
            if (i >= 8) {
                x += 244;
            }
            let size = 32;
            let y = boxY + 7 + (offset * size);

            let skill = keys[i];
            boundingBoxes.push({x, y, width: size, height: size, rockOrdinal: "first", skill});
            boundingBoxes.push({x: x + size, y, width: size, height: size, rockOrdinal: "second", skill});
        }

        return boundingBoxes;
    }

    private containsWhitePixel(imageData: ImageData) {
        for (let x = 0; x < imageData.width; x++) {
            for (let y = 0; y < imageData.height; y++) {
                let pixel = imageData.getPixel(x,y);
                if (pixel.every(value => value === 255)) {
                    return true;
                }
            }
        }
    }
}

export default new StatueCollectionBagImageProcessor();
