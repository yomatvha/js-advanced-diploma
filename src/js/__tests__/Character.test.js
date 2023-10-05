import Character from '../Character';
import Bowman from '../characters/Bowman';
import Daemon from '../characters/Daemon';
import Magician from '../characters/Magician';
import Swordsman from '../characters/Swordsman';
import Undead from '../characters/Undead';
import Vampire from '../characters/Vampire';

test('newCharacterToTrowError', () => {
  expect(() => new Character(1)).toThrow('Нельзя создавать персонажей, используя new Character()');
});

test('newBowmanNotToThrowError', () => {
  expect(() => new Bowman(1)).not.toThrow();
});

test('characteristicsBowman', () => {
  const expected = {
    attack: 25, defence: 25, health: 50, level: 1, move: 2, strike: 2, type: 'bowman',
  };
  const result = new Bowman(1);
  expect(result).toEqual(expected);
});

test('characteristicsDaemon', () => {
  const expected = {
    attack: 10, defence: 10, health: 50, level: 1, move: 1, strike: 4, type: 'daemon',
  };
  const result = new Daemon(1);
  expect(result).toEqual(expected);
});

test('characteristicsMagician', () => {
  const expected = {
    attack: 10, defence: 40, health: 50, level: 1, move: 1, strike: 4, type: 'magician',
  };
  const result = new Magician(1);
  expect(result).toEqual(expected);
});

test('characteristicsSwordsman', () => {
  const expected = {
    attack: 40, defence: 10, health: 50, level: 1, move: 4, strike: 1, type: 'swordsman',
  };
  const result = new Swordsman(1);
  expect(result).toEqual(expected);
});

test('characteristicsUndead', () => {
  const expected = {
    attack: 40, defence: 10, health: 50, level: 1, move: 4, strike: 1, type: 'undead',
  };
  const result = new Undead(1);
  expect(result).toEqual(expected);
});

test('characteristicsVampire', () => {
  const expected = {
    attack: 25, defence: 25, health: 50, level: 1, move: 2, strike: 2, type: 'vampire',
  };
  const result = new Vampire(1);
  expect(result).toEqual(expected);
});
