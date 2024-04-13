import day15 from './index';

describe('On Day 15', () =>{
    it(`part1 is identity function`, ()=>{
        expect(day15.solveForPartOne('hello')).toBe('hello');
    })
});