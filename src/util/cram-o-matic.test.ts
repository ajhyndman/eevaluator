import { computeGuaranteedRecipe } from './cram-o-matic';

describe('cram-o-matic', () => {
  describe('computeGuaranteedRecipe', () => {
    it('respects Big Mushroom recipe', () => {
      expect(
        computeGuaranteedRecipe('Tiny Mushroom', "King's Rock", 'Tiny Mushroom', 'Tiny Mushroom'),
      ).toBe('Big Mushroom');
    });

    it('respects Big Pearl recipe', () => {
      expect(computeGuaranteedRecipe('Pearl', "King's Rock", 'Pearl', 'Pearl')).toBe('Big Pearl');
    });

    it('respects Star Piece recipe', () => {
      expect(computeGuaranteedRecipe('Stardust', "King's Rock", 'Stardust', 'Stardust')).toBe(
        'Star Piece',
      );
    });

    it('respects Ability Capsule recipe', () => {
      expect(computeGuaranteedRecipe('Rare Candy', "King's Rock", 'Rare Candy', 'Rare Candy')).toBe(
        'Ability Capsule',
      );
    });

    it('respects Gold Bottle Cap recipe', () => {
      expect(computeGuaranteedRecipe('Bottle Cap', "King's Rock", 'Bottle Cap', 'Bottle Cap')).toBe(
        'Gold Bottle Cap',
      );
    });
  });
});
