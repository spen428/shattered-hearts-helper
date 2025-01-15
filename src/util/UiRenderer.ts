import StatueCollectionBag, { Rock } from "./StatueCollectionBag";

class UiRenderer {
  rerender(document: Document) {
    for (const rock of StatueCollectionBag.enumerate()) {
      const imgElement = this.getImgElementForRock(document, rock);
      imgElement.className = rock.isPresent ? "rock-in-bag" : "rock-missing";
    }

    this.highlightMostRecent(document, StatueCollectionBag.mostRecent.strange);
    this.highlightMostRecent(document, StatueCollectionBag.mostRecent.golden);
  }

  private getImgElementForRock(
    document: Document,
    rock: Rock,
  ): HTMLImageElement {
    return document.querySelector(
      `#${rock.type}-${rock.skill}-${rock.ordinal}`,
    );
  }

  private highlightMostRecent(document: Document, rock: Rock | null) {
    if (!rock) {
      return;
    }
    let imgElement = this.getImgElementForRock(document, rock);
    imgElement.className += " most-recent-rock";
  }
}

export default new UiRenderer();
