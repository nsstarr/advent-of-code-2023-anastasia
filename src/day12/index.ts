import { Day } from "../day";

class Day12 extends Day {
  constructor() {
    super(12);
  }

  solveForPartOne(input: string): string {
    const rows = input.trim().split("\n");

    const sum = (a: number, b: number): number => a + b;

    // Memoization cache to store calculated results
    const cache = new Map<string, number>();

    // Recursion to count different arrangements of operational and broken springs
    const countArrangements = (row: string, groupSizes: number[]): number => {
      // Remove trailing and leading '.' characters from the row
      row = row.replace(/^\.+|\.+$/, "");

      // Base cases for recursion
      if (row === "") return groupSizes.length ? 0 : 1;
      if (!groupSizes.length) return row.includes("#") ? 0 : 1;

      // Unique key to identify the current state
      const key = [row, groupSizes].join(" ");

      // Check if the result is already memoized
      if (cache.has(key)) return cache.get(key)!;

      // Initialize the result
      let result = 0;

      // Check if the current row has a damaged group matching the remaining size
      const damagedGroup = row.match(/^#+(?=\.|$)/);
      if (damagedGroup) {
        if (damagedGroup[0].length === groupSizes[0]) {
          // Recur with the updated row and remaining group sizes
          result += countArrangements(
            row.slice(groupSizes[0]),
            groupSizes.slice(1)
          );
        }
      } else if (row.includes("?")) {
        // Compute the total number of damaged springs
        const totalDamaged = groupSizes.reduce(sum, 0);

        // Recur with '?' replaced by '.' and by '#', if applicable
        result +=
          countArrangements(row.replace("?", "."), groupSizes) +
          ((row.match(/#/g) || []).length < totalDamaged
            ? countArrangements(row.replace("?", "#"), groupSizes)
            : 0);
      }

      // Memoize the result
      cache.set(key, result);
      return result;
    };

    // Function to count arrangements for each row
    const countArrangementsForRow = (rowString: string): number => {
      const [currentRow, damagedGroupSizes = ""] = rowString.split(" ");
      return countArrangements(
        currentRow,
        damagedGroupSizes.split(",").map(Number)
      );
    };

    // Calculate the sum of arrangements for all rows
    const totalArrangements = rows.map(countArrangementsForRow).reduce(sum, 0);
    return totalArrangements.toString();
  }

  solveForPartTwo(input: string): string {
    return input;
  }
}

export default new Day12();
