import { Day } from "../day";

class Day1 extends Day {
    constructor() {
        super(1);
    }

    solveForPartOne(input: string): string {
        const lines = input.split('\n');
        let sum = 0;
        for (let line of lines) {
            const firstDigit = line.match(/\d/)?.[0];
            const lastDigit = line.match(/\d(?=\D*$)/)?.[0];
            if (firstDigit && lastDigit) {
                const number = parseInt(firstDigit + lastDigit);
                sum += number;
            }
        }
        return sum.toString();
    }

    solveForPartTwo(input: string): string {
        return input.split('\n').map(l => {
            const dgs = l.split('')
                .map((c, i) => {
                    const wordDigit = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
                        .map((w, n) => <const>[w, n])
                        .filter(([w,]) => l.slice(i).startsWith(w))
                        .map(([, n]) => n + 1)
                        .at(0)
                    return wordDigit ?? parseInt(c)
                })
                .filter(n => !!n)
            return parseInt('' + dgs[0] + dgs.at(-1)!)!
        }).reduce((a, b) => a + b, 0).toString()
    }
}

export default new Day1();
