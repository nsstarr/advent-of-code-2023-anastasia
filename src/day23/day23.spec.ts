import day23 from './index';

describe('On Day 23', () =>{
    it(`part1 is identity function`, ()=>{
        expect(day23.solveForPartOne('hello')).toBe('hello');
    })
});