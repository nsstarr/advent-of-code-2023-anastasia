import day12 from './index';

describe('On Day 12', () =>{
    it(`part1 is identity function`, ()=>{
        expect(day12.solveForPartOne('hello')).toBe('hello');
    })
});