import { bagState } from "./StatueCollectionBag";

class UiRenderer {
  rerender(document: Document) {
    const bags = [
      { bag: bagState.strangeRocks, key: "Strange" },
      { bag: bagState.goldenRocks, key: "Golden" },
    ];
    for (const bag of bags) {
      for (const skill in bag.bag) {
        const rocks = bag.bag[skill];
        for (const rockOrdinal in rocks) {
          const isRockPresent = rocks[rockOrdinal];
          const imgElement = document.querySelector(
            `#${bag.key}-${skill}-${rockOrdinal}`,
          ) as HTMLImageElement;
          imgElement.style.opacity = isRockPresent ? "1" : "0.125";
        }
      }
    }
  }
}

export default new UiRenderer();
