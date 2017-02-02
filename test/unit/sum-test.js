import sum from '../../sum';
import Promise from 'bluebird'

const sumPromisified = (a, b) => new Promise(resolve => resolve(sum(a, b)));

describe('First describe', () => {
  it('adds 5 + 15 to equal 14 (from path test/unit) - error', () => {
    return sumPromisified(5, 10).then(result => {
      expect(result).toBe(14);
    });
  });

  it('adds 1 + 2 to equal 3 (from path test/unit) - error', () => {
    return sumPromisified(1, 2).then(result => {
      expect(result).toBe(3);
    });
  });
});
