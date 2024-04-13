// @ts-nocheck
import { Day } from "../day";
import { Deque } from "@blakeembrey/deque";

// Utility functions for encoding and decoding coordinates
const encodeCoordinates = (x: number, y: number): number =>
  x >= y ? x * x + x + y : y * y + x;

const decodeCoordinates = (z: number): [number, number] => {
  const q = Math.floor(Math.sqrt(z));
  const l = z - q * q;
  return l < q ? [l, q] : [q, l - q];
};

class Day23 extends Day {
  constructor() {
    super(23);
  }

  solveForPartOne(input: string): string {
    const map = input.split("\n").map((line) => line.split(""));

    const startX = 1;
    const startY = 0;

    const endX = map[0].length - 2;
    const endY = map.length - 1;

    const queue = new Deque<[number, number, number, number[]]>([
      [startX, startY, 0, [encodeCoordinates(startX, startY)]],
    ]);

    const hikes = [];

    while (queue.size > 0) {
      const [x, y, steps, visited] = queue.popLeft();

      if (x === endX && y === endY) {
        hikes.push(steps);
      }

      const neighbors = [];

      const tile = map[y][x];

      if (tile === ".") {
        if (map[y]?.[x - 1] !== ">") neighbors.push([x - 1, y]);
        if (map[y]?.[x + 1] !== "<") neighbors.push([x + 1, y]);
        if (map[y - 1]?.[x] !== "v") neighbors.push([x, y - 1]);
        if (map[y + 1]?.[x] !== "^") neighbors.push([x, y + 1]);
      } else {
        if (tile === ">") neighbors.push([x + 1, y]);
        if (tile === "<") neighbors.push([x - 1, y]);
        if (tile === "^") neighbors.push([x, y - 1]);
        if (tile === "v") neighbors.push([x, y + 1]);
      }

      for (const [nx, ny] of neighbors) {
        if (
          nx < 0 ||
          ny < 0 ||
          nx >= map[0].length ||
          ny >= map.length ||
          map[ny][nx] === "#"
        ) {
          continue;
        }

        const key = encodeCoordinates(nx, ny);

        if (!visited.includes(key)) {
          queue.push([nx, ny, steps + 1, [...visited, key]]);
        }
      }
    }

    return hikes.sort((a, b) => b - a)[0].toString();
  }

  solveForPartTwo(input: string): string {
    const map = input.split("\n").map((line) => line.split(""));

    const start = encodeCoordinates(1, 0);
    const end = encodeCoordinates(map[0].length - 2, map.length - 1);

    const intersections = [start, end, ...this.getIntersections(map)];

    const connections = this.getConnections(map, intersections);

    return this.getLongestPath(connections, start, end).toString();
  }

  private getIntersections(map: string[][]): number[] {
    const intersections = [];

    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[0].length; x++) {
        if (map[y][x] === ".") {
          let neighbors = [
            map[y][x - 1],
            map[y][x + 1],
            map[y - 1]?.[x],
            map[y + 1]?.[x],
          ].filter((x) => x === "#");

          if (neighbors.length < 2) {
            intersections.push(encodeCoordinates(x, y));
          }
        }
      }
    }

    return intersections;
  }

  private getConnections(
    map: string[][],
    intersections: number[]
  ): Map<number, [number, number][]> {
    const connections = new Map<number, [number, number][]>();

    for (const intersection of intersections) {
      connections.set(intersection, []);
    }

    for (const intersection of intersections) {
      const [x, y] = decodeCoordinates(intersection);

      const queue = [[x, y, 0]];
      const visited = new Set<number>([intersection]);

      while (queue.length > 0) {
        const [x, y, distance] = queue.pop();

        if (distance !== 0 && intersections.includes(encodeCoordinates(x, y))) {
          connections.get(intersection).push([encodeCoordinates(x, y), distance]);
          continue;
        }

        const neighbors = [
          [x - 1, y],
          [x + 1, y],
          [x, y - 1],
          [x, y + 1],
        ].filter(
          ([x, y]) =>
            x >= 0 &&
            y >= 0 &&
            x < map[0].length &&
            y < map.length &&
            map[y][x] !== "#"
        );

        for (const [nx, ny] of neighbors) {
          if (!visited.has(encodeCoordinates(nx, ny))) {
            queue.push([nx, ny, distance + 1]);
            visited.add(encodeCoordinates(nx, ny));
          }
        }
      }
    }

    return connections;
  }

  private getLongestPath(
    connections: Map<number, [number, number][]>,
    current: number,
    end: number,
    visited = new Set<number>()
  ): number {
    if (current === end) return 0;

    let maxDistance = Number.MIN_SAFE_INTEGER;

    visited.add(current);

    for (let [neighbour, distance] of connections.get(current)) {
      if (!visited.has(neighbour)) {
        maxDistance = Math.max(
          maxDistance,
          distance + this.getLongestPath(connections, neighbour, end, visited)
        );
      }
    }

    visited.delete(current);

    return maxDistance;
  }
}

export default new Day23();
