import day13 from './index';

describe('On Day 13', () =>{
    it(`part1 is identity function`, ()=>{
        expect(day13.solveForPartOne('hello')).toBe('hello');
    })
});