import day5 from './index';

describe('On Day 5', () =>{
    it(`part1 is identity function`, ()=>{
        expect(day5.solveForPartOne('hello')).toBe('hello');
    })
});