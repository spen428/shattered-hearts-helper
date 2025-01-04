import {captureHoldFullRs, ImageDetect, ImgRef, mixColor, PasteInput} from "@alt1/base";
import "./index.html";
import "./appconfig.json";
import "./icon.png";
import Logger from "./util/Logger";

const CAPTURE_INTERVAL_MS = 2000;

function captureAndProcessChatBox() {
    if (!window.alt1) {
        return;
    }

    const img = captureHoldFullRs();
    processScreenshot(img);
}

function processScreenshot(img: ImgRef) {
    const match = img.findSubimage(subImages.statueCollectionBagHeader)[0];
    if (!match) {
        return;
    }

    Logger.writeLog("The Statue Collection Bag UI is open");

    if (window.alt1) {
        alt1.overLayRect(mixColor(255, 255, 255), match.x, match.y + 55, 485, 270, CAPTURE_INTERVAL_MS, 2);
    }
}

function clearPasteTarget() {
    document.getElementById("output").innerHTML = "";
}

const subImages = ImageDetect.webpackImages({
    statueCollectionBagHeader: require("./statue-collection-bag.data.png")
});

if (window.alt1) {
    alt1.identifyAppUrl("./appconfig.json");
    setInterval(() => captureAndProcessChatBox(), CAPTURE_INTERVAL_MS);
} else {
    const addAppUrl = `alt1://addapp/${new URL("./appconfig.json", document.location.href).href}`;
    document
        .getElementById("output")
        .insertAdjacentHTML(
            "beforeend",
            `Alt1 not detected, click <a href='${addAppUrl}'>here</a> to add this app to Alt1.`,
        );
}

PasteInput.listen(
    (img) => {
        processScreenshot(img);
        clearPasteTarget();
    },
    (err, errid) => Logger.writeError(`${errid} ${err}`),
);
