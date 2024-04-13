import day6 from './index';

describe('On Day 6', () =>{
    it(`part1 is identity function`, ()=>{
        expect(day6.solveForPartOne('hello')).toBe('hello');
    })
});