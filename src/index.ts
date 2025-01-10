import "./index.html";
import "./appconfig.json";
import "./icon.png";
import StatueCollectionBagImageProcessor from "./util/StatueCollectionBagImageProcessor";
import { CAPTURE_INTERVAL_MS } from "./config";
import UiRenderer from "./util/UiRenderer";
import { captureHoldFullRs } from "alt1";

function captureAndProcessGameWindow() {
  if (!window.alt1) {
    return;
  }

  const img = captureHoldFullRs();
  StatueCollectionBagImageProcessor.processScreenshot(img);
  UiRenderer.rerender(document);
}

function start() {
  if (window.alt1) {
    alt1.identifyAppUrl("./appconfig.json");
    setInterval(() => captureAndProcessGameWindow(), CAPTURE_INTERVAL_MS);
  } else {
    const addAppUrl = `alt1://addapp/${new URL("./appconfig.json", document.location.href).href}`;
    document
      .getElementById("log")
      .insertAdjacentHTML(
        "beforeend",
        `<span>Alt1 not detected, click <a href='${addAppUrl}'>here</a> to add this app to Alt1.</span>`,
      );
  }
}

start();
