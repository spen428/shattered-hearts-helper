export type RockBag = { [key: string]: { first: boolean; second: boolean } };

export const bagState = {
  strangeRocks: {
    Agility: { first: false, second: false },
    Construction: { first: false, second: false },
    Cooking: { first: false, second: false },
    Crafting: { first: false, second: false },
    Farming: { first: false, second: false },
    Firemaking: { first: false, second: false },
    Fishing: { first: false, second: false },
    Fletching: { first: false, second: false },
    Herblore: { first: false, second: false },
    Hunter: { first: false, second: false },
    Mining: { first: false, second: false },
    Runecrafting: { first: false, second: false },
    Smithing: { first: false, second: false },
    Thieving: { first: false, second: false },
    Woodcutting: { first: false, second: false },
  },
  goldenRocks: {
    Agility: { first: false, second: false },
    Construction: { first: false, second: false },
    Crafting: { first: false, second: false },
    Divination: { first: false, second: false },
    Dungeoneering: { first: false, second: false },
    Farming: { first: false, second: false },
    Herblore: { first: false, second: false },
    Magic: { first: false, second: false },
    Melee: { first: false, second: false },
    Mining: { first: false, second: false },
    Prayer: { first: false, second: false },
    Ranged: { first: false, second: false },
    Slayer: { first: false, second: false },
    Smithing: { first: false, second: false },
    Summoning: { first: false, second: false },
    Woodcutting: { first: false, second: false },
  },
};

class StatueCollectionBag {
  mostRecent: {
    strange: Rock | null;
    golden: Rock | null;
  } = {
    strange: null,
    golden: null,
  };

  enumerate(): Rock[] {
    const rocks: Rock[] = [];
    const bags = {
      strange: bagState.strangeRocks,
      golden: bagState.goldenRocks,
    };

    for (const rockType of rockTypes) {
      const rockBag = bags[rockType];
      const skills = Object.keys(rockBag);

      for (const skill of skills) {
        for (const ordinal of rockOrdinals) {
          rocks.push({
            type: rockType,
            skill,
            ordinal,
            isPresent: rockBag[skill][ordinal],
          });
        }
      }
    }

    return rocks;
  }

  getRockBag(rockType: RockType | string) {
    if (rockType === "golden") {
      return bagState.goldenRocks;
    }
    if (rockType === "strange") {
      return bagState.strangeRocks;
    }
    throw new Error("Argument error");
  }

  getRockIsPresent(
    rockType: RockType,
    skill: string,
    rockOrdinal: RockOrdinal,
  ): boolean {
    const rockBag = this.getRockBag(rockType);
    return rockBag[skill][rockOrdinal];
  }

  setRockIsPresent(
    rockType: RockType,
    skill: string,
    rockOrdinal: RockOrdinal,
    isPresent: boolean,
  ) {
    const rockBag = this.getRockBag(rockType);
    rockBag[skill][rockOrdinal] = isPresent;
  }

  getRockCount(rockType: RockType, skill: string): number {
    let count = 0;
    if (this.getRockIsPresent(rockType, skill, "first")) {
      count++;
    }
    if (this.getRockIsPresent(rockType, skill, "second")) {
      count++;
    }
    return count;
  }

  addRock(rockType: RockType | string, skillName: string): Rock {
    const rockBag = this.getRockBag(rockType);

    let ordinal: RockOrdinal = "second";
    if (!rockBag[skillName].first) {
      ordinal = "first";
    }

    rockBag[skillName][ordinal] = true;

    this.mostRecent[rockType] = {
      type: rockType as RockType,
      skill: skillName,
      ordinal,
      isPresent: true,
    };
    return this.mostRecent[rockType];
  }

  getSkills(rockType: RockType): string[] {
    return Object.keys(this.getRockBag(rockType));
  }
}

const rockTypes = ["strange", "golden"] as const;
export type RockType = (typeof rockTypes)[number];

const rockOrdinals = ["first", "second"] as const;
export type RockOrdinal = (typeof rockOrdinals)[number];

export interface Rock {
  type: RockType;
  skill: string;
  ordinal: RockOrdinal;
  isPresent: boolean;
}

export default new StatueCollectionBag();
