import StatueCollectionBag from "./StatueCollectionBag";

class UiRenderer {
  rerender(document: Document) {
    for (const rock of StatueCollectionBag.enumerate()) {
      const imgElement = document.querySelector(
        `#${rock.type}-${rock.skill}-${rock.ordinal}`,
      ) as HTMLImageElement;
      imgElement.className = rock.isPresent ? "rock-in-bag" : "rock-missing";
    }
  }
}

export default new UiRenderer();
