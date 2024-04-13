import day8 from './index';

describe('On Day 8', () =>{
    it(`part1 is identity function`, ()=>{
        expect(day8.solveForPartOne('hello')).toBe('hello');
    })
});