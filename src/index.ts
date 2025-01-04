import {captureHoldFullRs, PasteInput} from "@alt1/base";
import "./index.html";
import "./appconfig.json";
import "./icon.png";
import Logger from "./util/Logger";
import StatueCollectionBagImageProcessor from "./util/StatueCollectionBagImageProcessor";
import {CAPTURE_INTERVAL_MS} from "./config";

function captureAndProcessChatBox() {
    if (!window.alt1) {
        return;
    }

    const img = captureHoldFullRs();
    StatueCollectionBagImageProcessor.processScreenshot(img);
}

function start() {
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
            StatueCollectionBagImageProcessor.processScreenshot(img);
        },
        (err, errid) => Logger.writeError(`${errid} ${err}`),
    );
}

start();
