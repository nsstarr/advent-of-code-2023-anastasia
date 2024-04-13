import day2 from './index';

describe('On Day 2', () =>{
    it(`part1 is identity function`, ()=>{
        expect(day2.solveForPartOne('hello')).toBe('hello');
    })
});