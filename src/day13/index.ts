import { Day } from "../day";

class Day13 extends Day {
  constructor() {
    super(13);
  }

  solveForPartOne(input: string): string {
    // Split the input into patterns
    const patterns = input.trim().split("\n\n");
    let answer = 0;

    patterns.forEach((pattern) => {
      // Split pattern into rows
      const rows = pattern.split("\n");
      // Convert rows to grid
      const grid = rows.map((row) => row.split(""));
      // Create columns by transposing the grid
      const cols = grid[0].map((_, c) => grid.map((row) => row[c].toString()).join(""));

      let fr = 0;
      let fc = 0;

      // Hunt for column reflection
      for (let c = 1; c < cols.length; c++) {
        let maxLength = Math.min(c, cols.length - c);
        let left = cols.slice(c - maxLength, c);
        let right = cols.slice(c, c + maxLength);
        right.reverse();
        if (left.toString() === right.toString()) {
          if (fc !== 0) {
            console.log("TWO COLUMN REFLECTIONS", pattern, fc, c);
          }
          answer += c;
          fc = c;
        }
      }

      // Hunt for row reflection
      for (let r = 1; r < rows.length; r++) {
        let maxLength = Math.min(r, rows.length - r);
        let top = rows.slice(r - maxLength, r);
        let bottom = rows.slice(r, r + maxLength);
        bottom.reverse();
        if (top.toString() === bottom.toString()) {
          if (fr !== 0) {
            console.log("TWO ROW REFLECTIONS", pattern, fr, r);
          }
          answer += r * 100;
          fr = r;
        }
      }

      if (fr !== 0 && fc !== 0) {
        console.log("HERE");
      }
      if (fr === 0 && fc === 0) {
        console.log(`NO REFLECTIONS\n`, pattern);
      }
    });

    return answer.toString();
  }

  solveForPartTwo(input: string): string {
    return input;
  }
}

export default new Day13();
