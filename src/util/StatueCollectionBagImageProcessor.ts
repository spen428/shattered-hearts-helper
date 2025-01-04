import {ImgRef, mixColor} from "@alt1/base";
import Logger from "./Logger";
import {CAPTURE_INTERVAL_MS, subImages} from "../config";

export const bagState = {
    strangeRocks: {
        agility: 0,
        construction: 0,
        cooking: 0,
        crafting: 0,
        farming: 0,
        firemaking: 0,
        fishing: 0,
        fletching: 0,
        herblore: 0,
        hunter: 0,
        mining: 0,
        runecrafting: 0,
        smithing: 0,
        thieving: 0,
        woodcutting: 0,
    },
    goldenRocks: {
        agility: 0,
        construction: 0,
        crafting: 0,
        divination: 0,
        dungeoneering: 0,
        farming: 0,
        herblore: 0,
        magic: 0,
        melee: 0,
        mining: 0,
        prayer: 0,
        ranged: 0,
        slayer: 0,
        smithing: 0,
        summoning: 0,
        woodcutting: 0,
    },
};

class StatueCollectionBagImageProcessor {
    public processScreenshot(img: ImgRef) {
        const match = img.findSubimage(subImages.statueCollectionBagHeader)[0];
        if (!match) {
            return;
        }

        Logger.writeLog("The Statue Collection Bag UI is open");

        let boxY = match.y + 55;
        let boxX = match.x;

        const strangeRockBoundingBoxes = this.getRockBoundingBoxes(bagState.strangeRocks, boxX, boxY);

        for (const bb of strangeRockBoundingBoxes) {
            const matches = img.findSubimage(subImages.whitePixel, bb.x, bb.y, bb.width, bb.height);
            if (matches.length) {
                Logger.writeLog(`${bb.skill} ${bb.rockNumber}/2 is populated!`);
                bagState.strangeRocks[bb.skill] = bb.rockNumber;
            }
        }

        for (const bb of strangeRockBoundingBoxes.filter(x => x.rockNumber === 1)) {
            let statusText = `${bagState.strangeRocks[bb.skill]}/2`;
            Logger.writeLog(bb.skill + ":" + statusText);
        }

        if (window.alt1) {
            alt1.overLayRect(mixColor(255, 255, 255), boxX, boxY, 485, 270, CAPTURE_INTERVAL_MS, 2);

            for (const bb of strangeRockBoundingBoxes) {
                alt1.overLayRect(mixColor(0, 0, 255), bb.x, bb.y, bb.width, bb.height, CAPTURE_INTERVAL_MS, 1);
            }

            for (const bb of strangeRockBoundingBoxes.filter(x => x.rockNumber === 1)) {
                let statusText = `${bagState.strangeRocks[bb.skill]}/2`;
                alt1.overLayText(statusText, mixColor(255, 200, 0), 10, bb.x + 74, bb.y + 4, CAPTURE_INTERVAL_MS);
            }
        }
    }

    private getRockBoundingBoxes(rocks: { [key: string]: number }, boxX: number, boxY: number) {
        const boundingBoxes: {
            skill: string,
            rockNumber: 1 | 2,
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
            boundingBoxes.push({x, y, width: size, height: size, rockNumber: 1, skill});
            boundingBoxes.push({x: x + size, y, width: size, height: size, rockNumber: 2, skill});
        }

        return boundingBoxes;
    }
}

export default new StatueCollectionBagImageProcessor();
