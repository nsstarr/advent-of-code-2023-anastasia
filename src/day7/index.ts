import { Day } from "../day";

type Card =
  | "A"
  | "K"
  | "Q"
  | "J"
  | "T"
  | "9"
  | "8"
  | "7"
  | "6"
  | "5"
  | "4"
  | "3"
  | "2";

type Hand = {
  cards: Card[];
  bid: number;
};

const HandTypeStrength: Record<string, number> = {
  FiveOfAKind: 7,
  FourOfAKind: 6,
  FullHouse: 5,
  ThreeOfAKind: 4,
  TwoPair: 3,
  OnePair: 2,
  HighCard: 1,
};

type RankedHand = {
  hand: Hand;
  rank: number;
};

const priority = ["A", "K", "Q", "T", "9", "8", "7", "6", "5", "4", "3", "2", "J"].reverse();

function createPermutations(arr: Card[]): Card[][] {
  const jIndex = arr.findIndex((a) => a === "J");

  const permutations: Card[][] = [];

  for (let i = 1; i < 13; i++) {
    const copy = [...arr];
    // @ts-ignore
    copy[jIndex] = priority[i];
    permutations.push(copy);

    if (copy.includes("J")) {
      const newPermutations = createPermutations(copy);
      newPermutations.forEach((p) => permutations.push(p));
    }
  }

  return permutations;
}

function checkForType(hand: Card[]): number {
  let highest = -1;

  const permutations = createPermutations(hand);
  permutations.forEach((p) => {
    const it = checkForTypeInternal(p);
    if (it > highest) {
      highest = it;
    }
  });
  return highest;
}

function checkForTypeInternal(hand: Card[]): number {
  const counts = hand.reduce((acc, curr) => {
    if (acc[curr]) {
      acc[curr] += 1;
    } else {
      acc[curr] = 1;
    }
    return acc;
  }, {} as { [key: string]: number });

  const countValues = Object.values(counts);

  const sorted = countValues.sort((a, b) => b - a);

  if (sorted[0] === 5) {
    return 5;
  }

  if (sorted[0] === 4) {
    return 4;
  }

  if (sorted[0] === 3 && sorted[1] === 2) {
    return 3;
  }

  if (sorted[0] === 3) {
    return 2;
  }

  if (sorted[0] === 2 && sorted[1] === 2) {
    return 1;
  }

  if (sorted[0] === 2) {
    return 0;
  }

  return -1;
}

function compareHands(hand1: Hand, hand2: Hand): number {
  const h1 = hand1.cards;
  const h2 = hand2.cards;

  const h1Type = checkForType(h1);
  const h2Type = checkForType(h2);

  if (h1Type > h2Type) {
    return 1;
  }

  if (h1Type < h2Type) {
    return -1;
  }

  let location = 0;
  let h1Index = priority.findIndex((p) => p === h1[location]);
  let h2Index = priority.findIndex((p) => p === h2[location]);

  while (h1Index === h2Index) {
    location += 1;
    h1Index = priority.findIndex((p) => p === h1[location]);
    h2Index = priority.findIndex((p) => p === h2[location]);
  }

  if (h1Index > h2Index) {
    return 1;
  }
  if (h1Index < h2Index) {
    return -1;
  }
  throw new Error("this should have returned");
}

function rankHands(hands: Hand[]): RankedHand[] {
  return hands
    .map((hand) => ({ hand, rank: 1 }))
    .sort((a, b) => compareHands(a.hand, b.hand))
    .map((rankedHand, index, arr) => {
      if (index > 0 && compareHands(arr[index - 1].hand, rankedHand.hand) === 0) {
        rankedHand.rank = arr[index - 1].rank;
      } else {
        rankedHand.rank = index + 1;
      }
      return rankedHand;
    });
}

function calculateTotalWinnings(rankedHands: RankedHand[]): number {
  return rankedHands.reduce((total, { hand, rank }) => total + hand.bid * rank, 0);
}

class Day7 extends Day {
  constructor() {
    super(7);
  }
  parseInput(input: string): Hand[] {
    return input
      .trim()
      .split("\n")
      .map((line) => {
        const [cards, bid] = line.split(" ");
        return {
          cards: cards.split("") as Card[], // Split cards into individual characters
          bid: parseInt(bid, 10),
        };
      });
  }

  solveForPartOne(input: string): string {
    const hands = this.parseInput(input);
    const rankedHands = rankHands(hands);
    const totalWinnings = calculateTotalWinnings(rankedHands);

    console.log("Total Winnings (Part One):", totalWinnings);

    return totalWinnings.toString();
  }

  solveForPartTwo(input: string): string {
    const hands = this.parseInput(input);
    const rankedHands = rankHands(hands);
    const totalWinnings = calculateTotalWinnings(rankedHands);

    console.log("Total Winnings (Part Two):", totalWinnings);

    return totalWinnings.toString();
  }
}

export default new Day7();
