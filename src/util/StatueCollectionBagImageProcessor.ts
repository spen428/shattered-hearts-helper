import Logger from "./Logger";
import { CAPTURE_INTERVAL_MS, subImages } from "../config";
import ChatBoxProcessor from "./ChatBoxProcessor";
import StatueCollectionBag, { RockType } from "./StatueCollectionBag";
import { ImgRef, mixColor } from "alt1";

class StatueCollectionBagImageProcessor {
  public processScreenshot(img: ImgRef) {
    this.processChatBox(img);
    this.processStatueCollectionBagUi(img);
  }

  private readonly strangeRockChatRegex =
    /You find a (strange|golden) rock \(([A-Za-z]+)\) and add it to your bag/;
  private readonly goldenRockChatRegex =
    /You find a (golden) rock and add it to your bag \(([A-Za-z]+)\)/;

  private processChatBox(img: ImgRef) {
    let chatLines = ChatBoxProcessor.getChatLines(img);

    const lines = chatLines
      .filter((line) => line.text.includes("You find a"))
      .map((line) => {
        let match = line.text.match(this.strangeRockChatRegex);
        if (match) {
          return { line, match };
        }

        return { line, match: line.text.match(this.goldenRockChatRegex) };
      })
      .filter((line) => !!line.match);

    lines.forEach((line) => {
      const [_, rockType, skillName] = line.match;
      Logger.writeLog(line.line.text);

      const rock = StatueCollectionBag.addRock(rockType, skillName);
      Logger.writeLog(`Found ${rock.ordinal} ${rock.type} ${rock.skill} rock!`);
    });
  }

  private processStatueCollectionBagUi(img: ImgRef) {
    const match = img.findSubimage(subImages.statueCollectionBagHeader)[0];
    if (!match) {
      return;
    }

    Logger.writeLog("The Statue Collection Bag UI is open");

    let rockType: RockType = "strange";
    if (!!img.findSubimage(subImages.goldenRocksTabSelected)[0]) {
      rockType = "golden";
      Logger.writeLog("Golden rocks tab is open");
    } else {
      Logger.writeLog("Strange rocks tab is open");
    }

    let boxY = match.y + 55;
    let boxX = match.x;
    let boxW = 485;
    let boxH = 270;

    const rockBoundingBoxes = this.getRockBoundingBoxes(rockType, boxX, boxY);

    for (const boundingBox of rockBoundingBoxes) {
      let imageData = img.toData(
        boundingBox.x,
        boundingBox.y,
        boundingBox.width,
        boundingBox.height,
      );
      StatueCollectionBag.setRockIsPresent(
        rockType,
        boundingBox.skill,
        boundingBox.rockOrdinal,
        this.containsWhitePixel(imageData),
      );
    }

    if (window.alt1) {
      alt1.overLayRect(
        mixColor(255, 255, 255),
        boxX,
        boxY,
        boxW,
        boxH,
        CAPTURE_INTERVAL_MS,
        2,
      );

      for (const boundingBox of rockBoundingBoxes) {
        let rockIsPresent = StatueCollectionBag.getRockIsPresent(
          rockType,
          boundingBox.skill,
          boundingBox.rockOrdinal,
        );
        let color = rockIsPresent ? mixColor(0, 255, 0) : mixColor(0, 0, 255);
        alt1.overLayRect(
          color,
          boundingBox.x,
          boundingBox.y,
          boundingBox.width,
          boundingBox.height,
          CAPTURE_INTERVAL_MS,
          1,
        );
      }

      for (const boundingBox of rockBoundingBoxes.filter(
        (x) => x.rockOrdinal === "first",
      )) {
        let rockCount = StatueCollectionBag.getRockCount(
          rockType,
          boundingBox.skill,
        );
        let statusText = `${rockCount}/2`;
        alt1.overLayText(
          statusText,
          mixColor(255, 200, 0),
          10,
          boundingBox.x + 74,
          boundingBox.y + 4,
          CAPTURE_INTERVAL_MS,
        );
      }
    }
  }

  private getRockBoundingBoxes(rockType: RockType, boxX: number, boxY: number) {
    const boundingBoxes: {
      skill: string;
      rockOrdinal: "first" | "second";
      x: number;
      y: number;
      width: number;
      height: number;
    }[] = [];

    const skills = StatueCollectionBag.getSkills(rockType);

    for (let i = 0; i < skills.length; i++) {
      let x = boxX + 134;
      let offset = i % 8;
      if (i >= 8) {
        x += 244;
      }
      let size = 32;
      let y = boxY + 7 + offset * size;

      let skill = skills[i];
      boundingBoxes.push({
        x,
        y,
        width: size,
        height: size,
        rockOrdinal: "first",
        skill,
      });
      boundingBoxes.push({
        x: x + size,
        y,
        width: size,
        height: size,
        rockOrdinal: "second",
        skill,
      });
    }

    return boundingBoxes;
  }

  private containsWhitePixel(imageData: ImageData) {
    for (let x = 0; x < imageData.width; x++) {
      for (let y = 0; y < imageData.height; y++) {
        let pixel = imageData.getPixel(x, y);
        if (pixel.every((value) => value === 255)) {
          return true;
        }
      }
    }
  }
}

export default new StatueCollectionBagImageProcessor();
