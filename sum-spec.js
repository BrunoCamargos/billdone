import sum from './sum';

describe('Another describe', () => {
  it('adds 1 + 2 to equal 3', () => {
    console.log('adds 1 + 2 to equal 3');
    expect(sum(1, 2)).toBe(3);
  });
});
