import { Day } from "../day";

class Range {
  constructor(
    public readonly start: number,
    public readonly end: number,
    public isTransformed = false,
  ) {}

  get length() {
    return this.end - this.start;
  }

  public getIntersection(range: Range): Range | null {
    if (this.end <= range.start || this.start >= range.end) return null;
    return new Range(Math.max(this.start, range.start), Math.min(this.end, range.end));
  }

  public subtractIntersection(intersection: Range): Range[] {
    const result: Range[] = [];
    if (this.start < intersection.start) {
      result.push(new Range(this.start, intersection.start));
    }
    if (this.end > intersection.end) {
      result.push(new Range(intersection.end, this.end));
    }
    return result;
  }
}

class GardenMap {
  public destination: Range;
  public source: Range;

  constructor(mapStr: string) {
    const [destinationStart, sourceStart, length] = mapStr
      .split(' ')
      .filter((str) => str !== '')
      .map(Number);

    this.destination = new Range(destinationStart, destinationStart + length);
    this.source = new Range(sourceStart, sourceStart + length);
  }

  get offset() {
    return this.destination.start - this.source.start;
  }

  public transformRange(inputRange: Range): Range[] {
    if (inputRange.isTransformed) return [inputRange];
  
    const intersection = this.source.getIntersection(inputRange);
  
    if (!intersection) return [inputRange];
  
    const transformed = new Range(
      intersection.start + this.offset,
      intersection.end + this.offset,
      true,
    );
  
    const remainingRanges = inputRange.subtractIntersection(intersection);
  
    return [transformed, ...this.transformRanges(remainingRanges)];
  }
  
  private transformRanges(ranges: Range[]): Range[] {
    return ranges.flatMap(range => this.transformRange(range));
  }
}

class Day5 extends Day {
  constructor() {
    super(5);
  }

  solveForPartTwo(input: string): string {
    const parseSeedRanges = (line: string): Range[] => {
      const numbers = line
        .split(':')[1]
        .split(' ')
        .filter((number) => number !== '')
        .map(Number);
  
      const ranges: Range[] = [];
      for (let i = 0; i < numbers.length; i += 2) {
        ranges.push(new Range(numbers[i], numbers[i] + numbers[i + 1]));
      }
  
      return ranges;
    };
  
    const parseGardenMapGroups = (lines: string[]): GardenMap[][] => {
      const gardenMapGroups: GardenMap[][] = [];
      lines.forEach((line) => {
        if (line === '') {
          gardenMapGroups.push([]);
          return;
        }
        if (line.endsWith(':')) return;
        gardenMapGroups[gardenMapGroups.length - 1].push(new GardenMap(line));
      });
      return gardenMapGroups;
    };
  
    const resetTransformed = (ranges: Range[]): void => {
      for (const range of ranges) {
        range.isTransformed = false;
      }
    };
  
    const calculateGardenMapGroupTransform = (
        ranges: Range[],
        gardenMapGroup: GardenMap[],
      ): Range[] => {
        for (const gardenMap of gardenMapGroup) {
          ranges = ranges.flatMap((range) => {
            const transformedRanges = gardenMap.transformRange(range);
            console.log("Transformed Ranges:", transformedRanges);
            return transformedRanges;
          });
        }
        return ranges;
      };
  
    const calculateSeedLocation = (ranges: Range[], gardenMapGroups: GardenMap[][]): Range[] => {
      for (const gardenMapGroup of gardenMapGroups) {
        resetTransformed(ranges);
        ranges = calculateGardenMapGroupTransform(ranges, gardenMapGroup);
      }
      return ranges.flatMap(range => range.isTransformed ? [range] : []);
    };
  
    // Wrap the initial seed range in an array
    const seedRanges = [parseSeedRanges(input)[0]];
  
    console.log("Initial Seed Ranges:", seedRanges);
  
    const gardenMapGroups = parseGardenMapGroups(input.split('\n').slice(1));
  
    console.log("Parsed Garden Map Groups:", gardenMapGroups);
  
    const transformedRanges = calculateSeedLocation(seedRanges, gardenMapGroups);
  
    console.log("Transformed Ranges:", transformedRanges);
  
    // Use Math.max to find the maximum directly
    const maxEnd = Math.max(...transformedRanges.map(range => range.end));
  
    console.log("Max End:", maxEnd);
  
    return maxEnd.toString();
  }
  
  solveForPartOne(input: string): string {
    class GardenMap {
      destination: number;
      source: number;
      range: number;

      constructor(mapStr: string) {
        const [destination, source, range] = mapStr
          .split(' ')
          .filter((str) => str !== '')
          .map(Number);

        this.destination = destination;
        this.source = source;
        this.range = range;
      }

      public isInRange(input: number) {
        return input >= this.source && input < this.source + this.range;
      }

      public output(input: number) {
        return input + this.destination - this.source;
      }
    }

    const parseSeeds = (line: string) => {
      const parts = line.split(':');
      if (parts.length >= 2) {
        return parts[1]
          .split(/\s+/)
          .filter((number) => number !== "")
          .map(Number);
      } else {
        return [];
      }
    };

    const parseGardenMapGroups = (lines: string[]) => {
      const gardenMapGroups: GardenMap[][] = [];
      lines.forEach((line) => {
        if (line === "") {
          gardenMapGroups.push([]);
          return;
        }
        if (line.endsWith(":")) return;
        gardenMapGroups[gardenMapGroups.length - 1].push(new GardenMap(line));
      });
      return gardenMapGroups;
    };

    const calculateOutput = (input: number, gardenMapGroup: GardenMap[]) => {
      let output = input;
      for (const gardenMap of gardenMapGroup) {
        if (gardenMap.isInRange(output)) {
          output = gardenMap.output(output);
          if (input !== output) break;
        }
      }
      return output;
    };

    const calculateSeedLocation = (
      input: number,
      gardenMapGroups: GardenMap[][]
    ) => {
      let output = input;
      for (const gardenMapGroup of gardenMapGroups) {
        output = calculateOutput(output, gardenMapGroup);
      }
      return output;
    };

    const lines = input.split("\n").map((line) => line.trim());
    const seeds = parseSeeds(lines[0]);
    const gardenMapGroups = parseGardenMapGroups(lines.slice(1));
    const locations = seeds.map((seed) =>
      calculateSeedLocation(seed, gardenMapGroups)
    );

    return locations
      .reduce((acc, location) => Math.min(acc, location), Infinity)
      .toString();
  }
}

export default new Day5();
