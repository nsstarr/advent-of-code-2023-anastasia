import { Day } from "../day";

const parseLineAndClean = (line: string): number[] =>
  line
    .split(/\s+/)
    .filter((c) => c !== "")
    .map((c) => parseInt(c, 10));

const calculateDifferences = (valueHist: number[]) => {
  const differences = [valueHist];

  while (differences[differences.length - 1].some((n) => !isNaN(n))) {
    const lastDiff = differences[differences.length - 1];
    const newDiff = [];

    // Calculate differences between adjacent elements in the sequence
    for (let i = 1; i < lastDiff.length; i++) {
      const diff = lastDiff[i] - lastDiff[i - 1];
      newDiff.push(isNaN(diff) ? NaN : diff);
    }

    differences.push(newDiff);
  }

  // Map NaN values to the original sequence for each level of differences
  return differences.map((diff) => diff.map((val) => (isNaN(val) ? NaN : val)));
};

const predictNextValue = (valueDifferences: number[][]): number => {
  const diffs = valueDifferences.map((d) => [...d]);

  // Add a placeholder 0 to the last sequence of differences
  diffs[diffs.length - 1].push(0);

  // Fill in the predictions from the bottom up
  for (let i = diffs.length - 2; i >= 0; i--) {
    diffs[i].push(
      diffs[i][diffs[i].length - 1] + diffs[i + 1][diffs[i + 1].length - 1]
    );
  }

  return diffs[0][diffs[0].length - 1];
};

class Day9 extends Day {
  constructor() {
    super(9);
  }

  solveForPartOne(input: string): string {
    const lines = input.split("\n");
    const values = lines.map(parseLineAndClean).map(calculateDifferences);

    // Predict the next value for each sequence
    const predictions = values.map(predictNextValue);

    console.log("Input lines:", lines);
    console.log("Parsed values:", values);
    console.log("Part One predictions:", predictions);

    const result = predictions.reduce((a, b) => a + b).toString();
    console.log("Part 1 result:", result);

    return result;
  }

  solveForPartTwo(input: string): string {
    const lines = input.split("\n");
    const values = lines.map(parseLineAndClean).map(calculateDifferences);

    const predictBackwards = (valueDiffs: number[][]): number => {
      const diffs = valueDiffs.map((d) => [...d]);

      // Add a placeholder 0 to the beginning of the last sequence of differences
      diffs[diffs.length - 1] = [0, ...diffs[diffs.length - 1]];

      // Fill in the predictions from the top down
      for (let i = 1; i < diffs.length; i++) {
        diffs[i] = [diffs[i - 1][0] - diffs[i][0], ...diffs[i]];
      }

      return diffs[0][0];
    };

    const predictions = values.map(predictBackwards);

    console.log("Part Two predictions:", predictions);

    const result = predictions.reduce((a, b) => a + b).toString();
    console.log("Part 2 result:", result);

    return result;
  }
}

export default new Day9();
