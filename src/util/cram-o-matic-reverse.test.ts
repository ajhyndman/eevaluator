import { getOutputType, validateIngredients } from './cram-o-matic-reverse';

describe('getOutputType', () => {
  it('identifies upgrade as electric type', () => {
    expect(getOutputType('Upgrade')).toBe('Electric');
  });
});

describe('cram-o-matic-reverse', () => {
  describe('validateIngredients', () => {
    it('validates a correct recipe', () => {
      expect(
        validateIngredients('Strawberry Sweet', [
          'Flower Sweet',
          'Amulet Coin',
          'Air Balloon',
          'Focus Sash',
        ]),
      ).toBe(true);
    });

    it('invalidates an incorrect recipe', () => {
      expect(
        validateIngredients('Strawberry Sweet', [
          'Flower Sweet',
          'Amulet Coin',
          'Adamant Mint',
          'Focus Sash',
        ]),
      ).toBe(false);
    });

    it('validates a correct recipe with one ingredient missing', () => {
      expect(
        validateIngredients('Strawberry Sweet', ['Flower Sweet', 'Amulet Coin', 'Air Balloon']),
      ).toBe(true);
    });

    it('invalidates an incorrect recipe with one ingredient missing', () => {
      expect(
        validateIngredients('Strawberry Sweet', ['Fighting Memory', 'Amulet Coin', 'Adamant Mint']),
      ).toBe(false);
    });

    it('validates first ingredient only', () => {
      expect(validateIngredients('Strawberry Sweet', ['Flower Sweet'])).toBe(true);
    });

    it('invalidates first ingredient only', () => {
      expect(validateIngredients('Strawberry Sweet', ['Fighting Memory'])).toBe(false);
    });

    it('validates a valid "special recipe"', () => {
      expect(
        validateIngredients('Big Mushroom', [
          'Tiny Mushroom',
          "King's Rock",
          'Tiny Mushroom',
          'Tiny Mushroom',
        ]),
      ).toBe(true);
    });

    it('expects an upgrade to require electric type inputs', () => {
      expect(validateIngredients('Upgrade', ['Electric Memory'])).toBe(true);
    });
  });
});
