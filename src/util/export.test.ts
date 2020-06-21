import { Pokemon } from '@smogon/calc';

import { exportPokemon } from './export';
import { GENERATION } from './misc';

describe('exportPokemon', () => {
  it('Prints default pokemon', () => {
    const text = exportPokemon(new Pokemon(GENERATION, 'Pikachu'));
    expect(text).toBe(`Pikachu
Ability: Static
Level: 100
Serious Nature`);
  });

  it.skip('Does not print gender', () => {
    const text = exportPokemon(new Pokemon(GENERATION, 'Pikachu', { gender: 'M' }));
    expect(text).toBe(`Pikachu
Ability: Static
Level: 100
Serious Nature`);
  });

  it('Prints stats', () => {
    const text = exportPokemon(
      new Pokemon(GENERATION, 'Pikachu', {
        ivs: { hp: 10, atk: 10, def: 10, spa: 10, spd: 10, spe: 10 },
        evs: { hp: 20, atk: 20, def: 20, spa: 20, spd: 20, spe: 20 },
      }),
    );
    expect(text).toBe(`Pikachu
Ability: Static
Level: 100
IVs: 10 HP / 10 Atk / 10 Def / 10 Spe / 10 SpA / 10 SpD
EVs: 20 HP / 20 Atk / 20 Def / 20 Spe / 20 SpA / 20 SpD
Serious Nature`);
  });

  it('Prints partial stats', () => {
    const text = exportPokemon(
      new Pokemon(GENERATION, 'Pikachu', {
        ivs: { hp: 10, atk: 10, def: 10 },
        evs: { spa: 20, spd: 20, spe: 20 },
      }),
    );
    expect(text).toBe(`Pikachu
Ability: Static
Level: 100
IVs: 10 HP / 10 Atk / 10 Def
EVs: 20 Spe / 20 SpA / 20 SpD
Serious Nature`);
  });

  it('Prints pokemon with moves', () => {
    const text = exportPokemon(
      new Pokemon(GENERATION, 'Pikachu', {
        moves: ['Fake Out', 'Thunder Wave', 'Thunderbolt', 'Volt Switch'],
      }),
    );
    expect(text).toBe(`Pikachu
Ability: Static
Level: 100
Serious Nature
- Fake Out
- Thunder Wave
- Thunderbolt
- Volt Switch`);
  });

  it("Prints doesn't print null moves", () => {
    const text = exportPokemon(
      new Pokemon(GENERATION, 'Pikachu', {
        // @ts-ignore: This array shouldn't contain empty values, but we should also defend against it
        moves: [undefined, null, 'Fake Out'],
      }),
    );
    expect(text).toBe(`Pikachu
Ability: Static
Level: 100
Serious Nature
- Fake Out`);
  });
});
