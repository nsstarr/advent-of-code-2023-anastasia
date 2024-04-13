import { Day } from "../day";

const calculateNumberOfWays = (input: string): number => {
    const [time, distance] = input
      .split("\n")
      .map((line) =>
        line.trim().split(" ").filter(Boolean).slice(1).map(Number)
      );
  
    return time.reduce((acc, time, i) => {
      const sqrt = Math.sqrt(time ** 2 - 4 * distance[i]);
      const ib =
        Math.ceil((time + sqrt) / 2) - Math.floor((time - sqrt) / 2) - 1;
      return acc * ib;
    }, 1);
  };
  
  class Day6 extends Day {
    constructor() {
      super(6);
    }
  
    solveForPartOne(input: string): string {
      return calculateNumberOfWays(input).toString();
    }

    solveForPartTwo(input: string): string {
        const [time, distance] = input
          .split("\n")
          .map((line) => Number(line.replace(/\s+/g, "").split(":")[1]));
    
        const sqrt = Math.sqrt(time ** 2 - 4 * distance);
        return (Math.ceil((time + sqrt) / 2) - Math.floor((time - sqrt) / 2) - 1).toString();
      }
    }  

export default new Day6;