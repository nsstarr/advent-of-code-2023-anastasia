import { Day } from "../day";

interface NetworkMap {
  [key: string]: {
    L: string;
    R: string;
  };
}

class Day8 extends Day {
  constructor() {
    super(8);
  }
  // calculate the greatest common divisor
  private gcd(a: number, b: number): number {
    if (b === 0) return a;
    return this.gcd(b, a % b);
  }
  // calculate the least common multiple
  private lcm(a: number, b: number): number {
    return (a * b) / this.gcd(a, b);
  }

  private parseInput(input: string): [string[], string[]] {
    const lines = input.split("\n");
    const instruction = lines[0].split("");
    const network = lines.slice(2);

    return [instruction, network];
  }

  private buildNetworkMap(network: string[]): NetworkMap {
    return network.reduce((acc, curr) => {
      const [s, conns] = curr.split(" = ");
      if (!acc[s]) {
        // @ts-ignore
        acc[s] = {};
      }
      const cleanConns = conns.replace("(", "").replace(")", "").split(", ");
      acc[s].L = cleanConns[0];
      acc[s].R = cleanConns[1];
      return acc;
    }, {} as NetworkMap);
  }

  solveForPartOne(input: string): string {
    const [instruction, network] = this.parseInput(input);
    const networkMap = this.buildNetworkMap(network);

    let numOfSteps = 0;
    let currNode = "AAA";

    let instructionIdx = 0;

    while (currNode !== "ZZZ") {
      if (instructionIdx === instruction.length) {
        instructionIdx = 0;
      }
      // @ts-ignore
      currNode = networkMap[currNode][instruction[instructionIdx]];
      numOfSteps++;
      instructionIdx++;
      console.log(`After ${numOfSteps} at ${currNode}`);
    }

    return numOfSteps.toString();
  }

  solveForPartTwo(input: string): string {
    const [instruction, network] = this.parseInput(input);
    const networkMap = this.buildNetworkMap(network);

    let numOfSteps = 0;
    // Find all nodes that end with 'A'
    let currNodes = Object.keys(networkMap).filter((k) => k.endsWith("A"));

    let instructionIdx = 0;

    const finalNums: number[] = [];

    // Traverse each starting node until reaching a node that ends with 'Z'
    for (let k = 0; k < currNodes.length; k++) {
      instructionIdx = 0;
      numOfSteps = 0;
      let currNode = currNodes[k];
      while (!currNode.endsWith("Z")) {
        if (instructionIdx === instruction.length) {
          instructionIdx = 0;
        }

        currNode =
          networkMap[currNode][instruction[instructionIdx] as "L" | "R"];
        numOfSteps++;
        instructionIdx++;
        console.log(`After ${numOfSteps} at ${currNode}`);
      }
      finalNums.push(numOfSteps);
    }

    console.log(finalNums);
    
    // Find the least common multiple of all final step counts
    const answer = finalNums.reduce((acc, curr) => this.lcm(acc, curr), 1);

    return answer.toString();
  }
}

export default new Day8();
