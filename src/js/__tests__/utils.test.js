import { calcTileType } from '../utils';

test('utilsTest_1', () => {
  const index = 0;
  const boardSize = 8;
  const expected = 'top-left';
  const result = calcTileType(index, boardSize);

  expect(result).toBe(expected);
});

test('utilsTest_2', () => {
  const index = 5;
  const boardSize = 8;
  const expected = 'top';
  const result = calcTileType(index, boardSize);

  expect(result).toBe(expected);
});

test('utilsTest_3', () => {
  const index = 7;
  const boardSize = 8;
  const expected = 'top-right';
  const result = calcTileType(index, boardSize);

  expect(result).toBe(expected);
});

test('utilsTest_4', () => {
  const index = 16;
  const boardSize = 8;
  const expected = 'left';
  const result = calcTileType(index, boardSize);

  expect(result).toBe(expected);
});

test('utilsTest_5', () => {
  const index = 18;
  const boardSize = 8;
  const expected = 'center';
  const result = calcTileType(index, boardSize);

  expect(result).toBe(expected);
});

test('utilsTest_6', () => {
  const index = 23;
  const boardSize = 8;
  const expected = 'right';
  const result = calcTileType(index, boardSize);

  expect(result).toBe(expected);
});

test('utilsTest_7', () => {
  const index = 56;
  const boardSize = 8;
  const expected = 'bottom-left';
  const result = calcTileType(index, boardSize);

  expect(result).toBe(expected);
});

test('utilsTest_8', () => {
  const index = 60;
  const boardSize = 8;
  const expected = 'bottom';
  const result = calcTileType(index, boardSize);

  expect(result).toBe(expected);
});

test('utilsTest_9', () => {
  const index = 63;
  const boardSize = 8;
  const expected = 'bottom-right';
  const result = calcTileType(index, boardSize);

  expect(result).toBe(expected);
});

test('utilsTest_10', () => {
  const index = 7;
  const boardSize = 7;
  const expected = 'left';
  const result = calcTileType(index, boardSize);

  expect(result).toBe(expected);
});
