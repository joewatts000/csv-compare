const { compareCSVFiles, compareArrays } = require('./index.js');

describe('compareCSVFiles', () => {
  it('should return an array of strings', async () => {
    const result = await compareCSVFiles('./a.csv', './b.csv');
    expect(result).toBeInstanceOf(Array);
  });
});

describe('compareArrays', () => {
  it('should return an array of strings', async () => {
    const result = await compareArrays(['a', 'b', 'c'], ['a', 'b', 'c']);
    expect(result).toBeInstanceOf(Array);
  });

  it('should return an array of strings with the same length as the shortest array', async () => {
    const result = await compareArrays(['a', 'b', 'c'], ['a', 'b', 'c']);
    expect(result.length).toBe(3);
    const result2 = await compareArrays(['a', 'b', 'c'], ['a', 'b']);
    expect(result2.length).toBe(2);
  });

  it('should return only matching items', async () => {
    const result = await compareArrays(['a', 'b', 'c'], ['a', 'b', 'c']);
    expect(result).toEqual(['a', 'b', 'c']);
    const result2 = await compareArrays(['a', 'b', 'c'], ['a', 'b']);
    expect(result2).toEqual(['a', 'b']);
    const mixed = await compareArrays(['a', 'b', 'c', 1, 2, 4], ['a', 'b', 'd']);
    expect(mixed).toEqual(['a', 'b']);
    const unordered = await compareArrays(['a', 'b', 'c'], ['b', 'a', 'c']);
    expect(unordered).toEqual(['b', 'a', 'c']);
  });
});