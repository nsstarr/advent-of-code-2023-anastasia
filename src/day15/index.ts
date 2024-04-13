import { Day } from "../day";

type Lens = {
  label: string;
  focalLength: number;
  power?: number;
};

function hash(str: string): number {
  return str
    .split("")
    .reduce((total, c) => ((total + c.charCodeAt(0)) * 17) % 256, 0);
}

class Day15 extends Day {
  constructor() {
    super(15);
  }

  solveForPartOne(input: string): string {
    const steps = input.split(",");

    const sum = steps.reduce((total, step) => {
      const result = hash(step);
      console.log(`${step} becomes ${result}`);
      return total + result;
    }, 0);

    return sum.toString();
  }

  solveForPartTwo(input: string): string {
    const steps = input.split(",");

    // Array to represent 256 boxes, each containing an array of lenses
    const boxes: Lens[][] = [];

    // Calculate the hash based on the label of the lens
    function getHash(label: string): number {
      let result = 0;
      // Calculate the hash using the ASCII values of characters in the label
      for (let i = 0; i < label.length; i++) {
        result += label.charCodeAt(i);
        result *= 17;
        result %= 256;
      }
      return result;
    }

    for (const step of steps) {
      const label = /\w+/.exec(step)![0];
      const focalLength = parseInt(step.slice(-1));

      // Calculate the hash to determine the box
      const hash = getHash(label);

      // Ensure the box array exists
      boxes[hash] ??= [];

      if (step.includes("-")) {
        // Find the index of the lens with the matching label and remove it
        const lensIndex = boxes[hash].findIndex((lens) => lens.label === label);
        if (lensIndex >= 0) {
          boxes[hash].splice(lensIndex, 1);
        }
      } else {
        const existingLens = boxes[hash].find((lens) => lens.label === label);

        if (existingLens) {
          existingLens.focalLength = focalLength;
        } else {
          // If the lens does not exist, add a new lens to the box
          boxes[hash].push({ label, focalLength });
        }
      }
    }

    let powerSum = 0;
    boxes.forEach((box, boxIndex) => {
      box.forEach((lens, lensIndex) => {
        lens.power = (boxIndex + 1) * (lensIndex + 1) * lens.focalLength!;
        powerSum += lens.power;
      });
    });

    return powerSum.toString();
  }
}

export default new Day15();
