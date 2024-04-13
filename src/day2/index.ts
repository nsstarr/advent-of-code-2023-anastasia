import { Day } from "../day";

type CubeCounts = {
  red: number;
  green: number;
  blue: number;
  [color: string]: number;
};

type InititalMinSet = {
  red: number;
  green: number;
  blue: number;
};

class Day2 extends Day {
  constructor() {
    super(2);
  }

  solveForPartOne(input: string): string {
    const cubeCounts: CubeCounts = { red: 12, green: 13, blue: 14 };

    const games = input.split("\n");

    let sumOfPossibleGames = 0;

    for (const game of games) {
      const subsets = game.match(/\d+\s\w+/g) || [];

      let possible = true;

      for (const subset of subsets) {
        const [count, color] = subset.split(" ");
        const cubeCount = cubeCounts[color];

        if (parseInt(count) > cubeCount) {
          // The subset shows more cubes than available, mark the game as impossible
          possible = false;
          break;
        }
      }

      // If the game is possible, add its ID to the sum
      if (possible) {
        const gameId = parseInt(game.match(/\d+/)![0]);
        sumOfPossibleGames += gameId;
      }
    }

    return sumOfPossibleGames.toString();
  }

  solveForPartTwo(input: string): string {
    const cubeCounts = { red: 12, green: 13, blue: 14 };

    const games = input.split("\n");

    let sumOfPower = 0;

    for (const game of games) {
      const subsets = game.match(/\d+\s\w+/g) || [];

      // Calculate the minimum set of cubes
      const minSet = subsets.reduce(
        (min, subset) => {
          const [count, color] = subset.split(" ");
          const subsetCount = parseInt(count);

          min[color as keyof typeof cubeCounts] = Math.max(
            min[color as keyof typeof cubeCounts],
            subsetCount
          );

          return min;
        },
        { red: 0, green: 0, blue: 0 } as InititalMinSet
      );

      const power = minSet.red * minSet.green * minSet.blue;
      sumOfPower += power;
    }

    return sumOfPower.toString();
  }
}

export default new Day2();
