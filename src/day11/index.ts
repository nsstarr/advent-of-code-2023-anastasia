import { Day } from "../day";

type Point = [number, number]

class Day11 extends Day {
  constructor() {
    super(11);
  }

  solveForPartOne(input: string): string {
    const grid = this.parseInput(input);
    
    const galaxyMap = this.assignGalaxyNumbers(grid);
    const expandedPoints = this.expand(this.parse(input), 2); 
    const sumOfShortestPaths = this.sumPairDistances(expandedPoints);
    return sumOfShortestPaths.toString();
  }

  solveForPartTwo(input: string): string {
    const expandedPoints = this.expand(this.parse(input), 1_000_000);
    const sumOfShortestPaths = this.sumPairDistances(expandedPoints);
    return sumOfShortestPaths.toString();
  }
  private parseInput(input: string): string[][] {
    return input
      .trim()
      .split("\n")
      .map((row) => row.split(""));
  }


  private assignGalaxyNumbers(
    grid: string[][]
  ): Map<number, { row: number; col: number }> {
    const galaxyMap = new Map<number, { row: number; col: number }>();
    let galaxyNumber = 1;

    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        if (grid[row][col] === "#") {
          galaxyMap.set(galaxyNumber, { row, col });
          galaxyNumber++;
        }
      }
    }

    return galaxyMap;
  }



  private shortestPathLength(
    pos1: { row: number; col: number },
    pos2: { row: number; col: number },
    grid: string[][]
  ): number {
    const visited: boolean[][] = [];
    for (let i = 0; i < grid.length; i++) {
      visited.push(new Array(grid[0].length).fill(false));
    }

    const queue: { row: number; col: number; distance: number }[] = [];
    queue.push({ row: pos1.row, col: pos1.col, distance: 0 });
    visited[pos1.row][pos1.col] = true;

    while (queue.length > 0) {
      const current = queue.shift();

      if (current && current.row === pos2.row && current.col === pos2.col) {
        return current.distance;
      }

      const directions = [
        { row: -1, col: 0 },
        { row: 1, col: 0 },
        { row: 0, col: -1 },
        { row: 0, col: 1 },
      ];

      for (const dir of directions) {
        // @ts-ignore
        const newRow = current.row + dir.row;
        // @ts-ignore
        const newCol = current.col + dir.col;

        if (this.isValid(newRow, newCol, grid) && !visited[newRow][newCol]) {
          queue.push({
            row: newRow,
            col: newCol,
            // @ts-ignore
            distance: current.distance + 1,
          });
          visited[newRow][newCol] = true;
        }
      }
    }

    // If no path is found
    return -1;
  }

  private isValid(row: number, col: number, grid: string[][]): boolean {
    return (
      row >= 0 &&
      row < grid.length &&
      col >= 0 &&
      col < grid[0].length &&
      grid[row][col] !== "#"
    );
  }

  private parse(input: string): Point[] {
    const lines = input.trim().split('\n');
    const points: Point[] = [];
    for (let y = 0; y < lines.length; y++) {
      for (let x = 0; x < lines[0].length; x++) {
        if (lines[y][x] === '#') points.push([x, y]);
      }
    }
    return points;
  }
  
  private expand(points: Point[], factor: number): Point[] {
    const nonemptyYs = new Set<number>();
    const nonemptyXs = new Set<number>();
    let maxY = 0;
    let maxX = 0;
    for (const [x, y] of points) {
      nonemptyXs.add(x);
      nonemptyYs.add(y);
      maxY = Math.max(maxY, y);
      maxX = Math.max(maxX, x);
    }

    const prefixSumXs: number[] = new Array(maxX + 1).fill(0);
    const prefixSumYs: number[] = new Array(maxY + 1).fill(0);
    for (let x = 0; x <= maxX; x++) {
      prefixSumXs[x] =
        (prefixSumXs[x - 1] || 0) + (!nonemptyXs.has(x) ? 1 : 0);
    }
    for (let y = 0; y <= maxY; y++) {
      prefixSumYs[y] =
        (prefixSumYs[y - 1] || 0) + (!nonemptyYs.has(y) ? 1 : 0);
    }

    const expandedPoints = points.map(([px, py]) => [
      px + prefixSumXs[px] * (factor - 1),
      py + prefixSumYs[py] * (factor - 1),
    ]);

// @ts-ignore
    return expandedPoints;
}

  
  private manhattanDistance([ax, ay]: Point, [bx, by]: Point): number {
    return Math.abs(ax - bx) + Math.abs(ay - by)
  }
  
  private sumPairDistances(points: Point[]): number {
    const considered = new Set<string>();
    let sum = 0;

    for (const a of points) {
        for (const b of points) {
            if (a[0] === b[0] && a[1] === b[1]) continue;

            // Sort points to ensure [a, b] and [b, a] are treated the same
            const [sortedA, sortedB] = [a, b].sort((p1, p2) => {
                if (p1[0] === p2[0]) return p1[1] - p2[1];
                return p1[0] - p2[0];
            });

            const key = `${sortedA[0]}-${sortedA[1]}:${sortedB[0]}-${sortedB[1]}`;
            if (considered.has(key)) continue;

            const pathLength = this.manhattanDistance(a, b);

            sum += pathLength;
            considered.add(key);
        }
    }

    return sum;
}

}

export default new Day11();
