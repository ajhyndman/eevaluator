import { computeGeneralRecipe, computeRecipe, computeSpecialRecipe } from './cram-o-matic';

describe('cram-o-matic', () => {
  describe('computeSpecialRecipe', () => {
    it('respects Big Mushroom recipe', () => {
      expect(
        computeSpecialRecipe('Tiny Mushroom', "King's Rock", 'Tiny Mushroom', 'Tiny Mushroom'),
      ).toBe('Big Mushroom');
    });

    it('respects Big Pearl recipe', () => {
      expect(computeSpecialRecipe('Pearl', "King's Rock", 'Pearl', 'Pearl')).toBe('Big Pearl');
    });

    it('respects Star Piece recipe', () => {
      expect(computeSpecialRecipe('Stardust', "King's Rock", 'Stardust', 'Stardust')).toBe(
        'Star Piece',
      );
    });

    it('respects Ability Capsule recipe', () => {
      expect(computeSpecialRecipe('Rare Candy', "King's Rock", 'Rare Candy', 'Rare Candy')).toBe(
        'Ability Capsule',
      );
    });

    it('respects Gold Bottle Cap recipe', () => {
      expect(computeSpecialRecipe('Bottle Cap', "King's Rock", 'Bottle Cap', 'Bottle Cap')).toBe(
        'Gold Bottle Cap',
      );
    });
  });

  describe('computeGeneralRecipe', () => {
    it('can make a rock type item', () => {
      expect(computeGeneralRecipe('Hard Stone', 'Hard Stone', 'Big Nugget', 'Big Nugget')).toBe(
        'Eviolite',
      );
    });

    it('can make a steel type item', () => {
      expect(computeGeneralRecipe('Iron Ball', 'Hard Stone', 'Big Nugget', 'Big Nugget')).toBe(
        'Amulet Coin',
      );
    });

    it('can make a fairy type item', () => {
      expect(computeGeneralRecipe('Moon Stone', 'Moon Stone', 'Moon Stone', 'Moon Stone')).toBe(
        'Misty Seed',
      );
    });

    it('can make a sweet', () => {
      // TODO: This shouldn't return only one sweet?
      expect(computeGeneralRecipe('Moon Stone', 'Moon Stone', 'Fairy Memory', 'Fairy Memory')).toBe(
        'Strawberry Sweet',
      );
    });
  });

  describe('computeRecipe', () => {
    it('prioritizes Special recipes', () => {
      expect(computeRecipe('Tiny Mushroom', "King's Rock", 'Tiny Mushroom', 'Tiny Mushroom')).toBe(
        'Big Mushroom',
      );
    });

    it('falls back to General recipes', () => {
      expect(computeRecipe('Hard Stone', 'Hard Stone', 'Big Nugget', 'Big Nugget')).toBe(
        'Eviolite',
      );
    });
  });
});
