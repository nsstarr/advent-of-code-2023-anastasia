import day17 from './index';

describe('On Day 17', () =>{
    it(`part1 is identity function`, ()=>{
        expect(day17.solveForPartOne('hello')).toBe('hello');
    })
});