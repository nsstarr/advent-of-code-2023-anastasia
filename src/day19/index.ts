import { Day } from "../day";

type Part = {
  x: number;
  m: number;
  a: number;
  s: number;
};

type PartRange = Record<keyof Part, { start: number; end: number }>;

type Instruction = {
  source: string;
  key?: keyof Part;
  operation?: string;
  value?: number;
  target: string;
};

class Day19 extends Day {
  constructor() {
    super(19);
  }
  private map = new Map<string, Instruction[]>();

  private init(input: string[]) {
    const parts: Part[] = [];

    input.forEach((line) => {
      if (!line) return;
      if (line.startsWith('{')) {
        const part = line
          .replace(/[{}]/g, '')
          .split(',')
          .map((term) => term.split('='))
          .reduce<Part>((part, [key, value]) => ({ ...part, [key]: Number(value) }), { x: 0, m: 0, a: 0, s: 0 });
        parts.push(part);
        return;
      }

      const [name, instructionString] = line.replace('}', '').split('{');
      const instructions = instructionString.split(',').map<Instruction>((term) => {
        if (!term.includes(':')) {
          return { source: name, target: term } as Instruction;
        }
        const [opS, target] = term.split(':');
        return {
          source: name,
          target,
          key: opS[0],
          operation: opS[1],
          value: Number(opS.substring(2)),
        } as Instruction;
      });
      this.map.set(name, instructions);
    });

    return { parts };
  }

  private runInstructionOn(part: Part, instruction: Instruction) {
    if (!instruction.key || !instruction.value || !instruction.operation) return instruction.target;
    const value = part[instruction.key];
    switch (instruction.operation) {
      case '>':
        if (value > instruction.value) return instruction.target;
        else return null;
      case '<':
        if (value < instruction.value) return instruction.target;
        else return null;
      default:
        return null;
    }
  }

  solveForPartOne(input: string): string {
    const { parts } = this.init(input.split('\n'));

    const acceptedParts: Part[] = [];

    parts.forEach((part) => {
      // Starting point in the workflow
      let currentWorkflow = 'in';

      // Process the part until it is accepted or rejected
      while (!['A', 'R'].includes(currentWorkflow)) {
        for (const instruction of this.map.get(currentWorkflow) ?? []) {
          // Check if the part matches the condition in the rule
          const targetWorkflow = this.runInstructionOn(part, instruction);

          // If a target workflow is found, move to that workflow and break the loop
          if (targetWorkflow) {
            currentWorkflow = targetWorkflow;
            break;
          }
        }
      }

      // If the part is accepted, add it to acceptedParts array
      if (currentWorkflow === 'A') {
        acceptedParts.push(part);
      }
    });

    // Calculate the sum of ratings for all accepted parts
    const sumOfRatings = acceptedParts.reduce((sum, part) => sum + part.a + part.m + part.s + part.x, 0);

    // Convert the sum to a string and return
    return sumOfRatings.toString();
  }

  solveForPartTwo(input: string): string {
    return input.toString();
  }
}

export default new Day19();
