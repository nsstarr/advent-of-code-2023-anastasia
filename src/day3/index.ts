import { Day } from "../day";

interface Entity {
    type: 'number' | 'symbol';
    x: number;
    y: number;
    token: string;
    value?: number;
  }

class Day3 extends Day {
  constructor() {
    super(3);
  }

  solveForPartOne(input: string): string {
    const rows = input.split('\n');

    const cells = rows.map(row => row.split(''));

    const isPartNumber = (adjacents: string[]) => {
      const regex = /[^\.\d]/;
      return adjacents.some(e => e.match(regex));
    };

    // Get adjacent cells for a given cell index
    const adjacents = ([row, col]: [number, number]): string[] => {
      const width = cells[0].length;
      const height = cells.length;
      const flattenedSlice: string[] = [];
      // Determine the range of rows and columns to consider for the adjacent cells, making sure not to go beyond the edges of the grid
      const rowMin = Math.max(row - 1, 0);
      const rowMax = Math.min(row + 1, height - 1);
      const colMin = Math.max(col - 1, 0);
      const colMax = Math.min(col + 1, width - 1);

      for (let r = rowMin; r <= rowMax; r++) {
        const current = cells[r];
        for (let c = colMin; c <= colMax; c++) {
          if (!(c === col && r === row)) {
            flattenedSlice.push(current[c]);
          }
        }
      }
      return flattenedSlice;
    };

    let sum = 0;

    cells.forEach((row, rowIndex) => {
      let currentNumber = '';
      let currentValidated = false;

      const addIfPartNumber = () => {
        if (currentValidated) {
          sum += parseInt(currentNumber, 10);
          currentValidated = false;
        }
        currentNumber = '';
      };

      row.forEach((cell, columnIndex) => {
        if (cell.match(/\d/)) {
          currentNumber += cell;
          currentValidated ||= isPartNumber(adjacents([rowIndex, columnIndex]));
          
          if (columnIndex === row.length - 1) {
            addIfPartNumber();
          }
        } else {
          addIfPartNumber();
        }
      });
    });

    return sum.toString();
  }

  solveForPartTwo(input: string): string {
    const adjacent = (numberEntity: Entity, symbolEntity: Entity): boolean => {
      // Expand the number entity by one in each direction
      const x0 = numberEntity.x - 1;
      const x1 = numberEntity.x + (numberEntity.token ? numberEntity.token.length : 0);
      const y0 = numberEntity.y - 1;
      const y1 = numberEntity.y + 1;
      return (
        symbolEntity.x >= x0 &&
        symbolEntity.x <= x1 &&
        symbolEntity.y >= y0 &&
        symbolEntity.y <= y1
      );
    };

    const parse = (s: string): Entity[] => {
      const entities: Entity[] = [];
      s.split('\n').forEach((line, y) => {
        [...line.matchAll(/\d+/g)].forEach((m) =>
          entities.push({ type: 'number', x: m.index || 0, y, token: m[0], value: parseInt(m[0]) })
        );

        [...line.matchAll(/[^0-9\.]/g)].forEach((m) =>
          entities.push({ type: 'symbol', x: m.index || 0, y, token: m[0] })
        );
      });
      return entities;
    };

    const entities = parse(input);
    const numbers = entities.filter((e) => e.type === 'number');
    const symbols = entities.filter((e) => e.type === 'symbol');

    const result = symbols
      .filter((s) => s.token === '*')
      .map((s) => {
        const adjacentNumbers = numbers.filter((n) => adjacent(n, s)).map((n) => n.value || 0);
        return adjacentNumbers.length === 2 ? adjacentNumbers[0] * adjacentNumbers[1] : 0;
      })
      .reduce((a, b) => a + b, 0);

    return result.toString();
  }
}

export default new Day3();
