import day4 from './index';

describe('On Day 4', () =>{
    it(`part1 is identity function`, ()=>{
        expect(day4.solveForPartOne('hello')).toBe('hello');
    })
});