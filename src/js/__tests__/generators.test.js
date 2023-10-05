import { characterGenerator } from '../generators';

test('newCharacters', () => {
  const types = ['bowman', 'swordsman', 'magician'];
  const expected = 4;
  const playerGenerator = characterGenerator(types, 3);
  const result = [
    playerGenerator.next().value,
    playerGenerator.next().value,
    playerGenerator.next().value,
    playerGenerator.next().value,
  ];
  expect(result.length).toBe(expected);
});
