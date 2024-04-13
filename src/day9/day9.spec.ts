import day9 from './index';

describe('On Day 9', () =>{
    it(`part1 is identity function`, ()=>{
        expect(day9.solveForPartOne('hello')).toBe('hello');
    })
});