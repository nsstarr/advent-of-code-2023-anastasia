import { Day } from "../day";

class Day4 extends Day {
  constructor() {
    super(4);
  }

  solveForPartOne(input: string): string {
    const games = input.trim().split("\n");

    let totalPoints = 0;

    games.forEach((game) => {
      const [winningNumbers, yourNumbers] = game
        .substring(game.indexOf(":") + 1)
        .split("|")
        .map((part) =>
          part
            .trim()
            .split(/\s+/) // Handles multiple spaces
            .map((n) => parseInt(n, 10))
            .filter((num) => !isNaN(num))
        );

      let points = yourNumbers.reduce(
        (count, num) => (winningNumbers.includes(num) ? count + 1 : count),
        0
      );
      points = points === 0 ? 0 : 2 ** (points - 1);

      totalPoints += points;
    });

    return totalPoints.toString();
  }

  solveForPartTwo(input: string): string {
    const lines = input.trim().split("\n");

    let sum1 = 0;
    // Fill the values of card copy tracker with 1
    const cardCopyTracker: number[] = lines.map(() => 1);

    lines.forEach((card, cardIdx) => {
      const nums = card.split(": ")[1];

      const [winNums, myNums] = nums.split(" | ").map((numStr) =>
        numStr.split(" ").filter(s => s !== "").map((n) => Number.parseInt(n))
      );

      let matchCount = 0;
      myNums.forEach((n) => {
        // Check if my number is in winning number list
        if (winNums.includes(n)) matchCount++;
      });

      if (matchCount > 0) {
        sum1 += Math.pow(2, matchCount - 1);

        const currentCardCopies = cardCopyTracker[cardIdx];
        // Get the card indexes for which we need to increase the count
        const startIdx = cardIdx + 1;
        const endIdx = Math.min(lines.length - 1, cardIdx + matchCount);
        // Run the loop from start to end and add the counts
        for (let i = startIdx; i <= endIdx; i++) {
          cardCopyTracker[i] += currentCardCopies;
        }
      }
    });

    const sum2 = cardCopyTracker.reduce((acc, count) => (acc += count), 0);
    return sum2.toString();
  }
}

export default new Day4();
