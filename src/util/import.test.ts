import { importPokemon } from './import';

describe('importPokemon', () => {
  it('throws on empty string', () => {
    const t = () => importPokemon('');
    expect(t).toThrow(Error);
  });

  it('handles only species', () => {
    const pokemon = importPokemon('Pikachu');
    expect(pokemon.name).toBe('Pikachu');
  });

  it('ignores whitespace', () => {
    const pokemon = importPokemon('\n\n  Pikachu  \n\n');
    expect(pokemon.name).toBe('Pikachu');
  });

  describe('first line parser', () => {
    it('handles nickname, species, gender and item', () => {
      const pokemon = importPokemon('Pika (Pikachu) (M) @ Life Orb');
      expect(pokemon.name).toBe('Pikachu');
      expect(pokemon.gender).toBe('M');
      expect(pokemon.item).toBe('Life Orb');
    });

    it('handles nickname and species', () => {
      const pokemon = importPokemon('Pika (Pikachu)');
      expect(pokemon.name).toBe('Pikachu');
    });

    it('handles species and gender', () => {
      const pokemon = importPokemon('Pikachu (M)');
      expect(pokemon.name).toBe('Pikachu');
      expect(pokemon.gender).toBe('M');
    });

    it('handles species and item', () => {
      const pokemon = importPokemon('Pikachu @ Magnet');
      expect(pokemon.name).toBe('Pikachu');
      expect(pokemon.item).toBe('Magnet');
    });

    it('handles trailing whitespace', () => {
      const pokemon = importPokemon('Crawdaunt @ Life Orb  \n');
      expect(pokemon.item).toBe('Life Orb');
    });
  });

  describe('stat row parser', () => {
    it('handles full row', () => {
      const pokemon = importPokemon(`
        Pikachu
        IVs: 0 HP / 0 Atk / 0 Def / 0 SpA / 0 SpD / 0 Spe
      `);
      expect(pokemon.ivs).toEqual({ hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 });
    });

    it('handles partial row', () => {
      const pokemon = importPokemon(`
        Pikachu
        IVs: 0 HP / 0 SpD / 0 Spe
      `);
      expect(pokemon.ivs).toEqual({ hp: 0, atk: 31, def: 31, spa: 31, spd: 0, spe: 0 });
    });

    it('handles empty row', () => {
      const pokemon = importPokemon(`
        Pikachu
        IVs:
      `);
      expect(pokemon.ivs).toEqual({ hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 });
    });

    it('handles EV row', () => {
      const pokemon = importPokemon(`
        Pikachu
        EVs: 0 HP / 0 Atk / 0 Def / 0 SpA / 0 SpD / 0 Spe
      `);
      expect(pokemon.evs).toEqual({ hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 });
    });
  });

  describe('move parser', () => {
    it('handles names with spaces', () => {
      const pokemon = importPokemon(`
        Pikachu
        - Thunder Wave
      `);
      expect(pokemon.moves).toContain('Thunder Wave');
    });

    it('handles four rows', () => {
      const pokemon = importPokemon(`
        Pikachu
        - Thunder Wave
        - Thunderbolt
        - Fake Out
        - Volt Switch
      `);
      expect(pokemon.moves).toContain('Thunder Wave');
      expect(pokemon.moves).toContain('Thunderbolt');
      expect(pokemon.moves).toContain('Fake Out');
      expect(pokemon.moves).toContain('Volt Switch');
    });

    it('rejects five rows', () => {
      const t = () =>
        importPokemon(`
        Pikachu
        - Thunder Wave
        - Thunderbolt
        - Fake Out
        - Volt Switch
        - Protect
      `);
      expect(t).toThrow();
    });
  });

  describe('remaining row parsers', () => {
    it('accepts gigantamax', () => {
      const pokemon = importPokemon(`
        Pikachu
        Gigantamax: Yes
      `);
    });

    it('handle ability', () => {
      const pokemon = importPokemon(`
        Pikachu
        Ability: Lightning Rod
      `);
      expect(pokemon.ability).toBe('Lightning Rod');
    });

    it('accept shiny', () => {
      importPokemon(`
        Pikachu
        Shiny: Yes
      `);
    });

    it('handle nature', () => {
      const pokemon = importPokemon(`
        Pikachu
        Bold Nature
      `);
      expect(pokemon.nature).toBe('Bold');
    });

    it('handle level', () => {
      const pokemon = importPokemon(`
        Pikachu
        Level: 99
      `);
      expect(pokemon.level).toBe(99);
    });

    it('accepts happiness', () => {
      importPokemon(`
        Pikachu
        Happiness: 255
      `);
    });

    it('are order independent', () => {
      const pokemon1 = importPokemon(`
        Pikachu
        Bold Nature
        Level: 99
        Ability: Lightning Rod
      `);
      const pokemon2 = importPokemon(`
        Pikachu
        Ability: Lightning Rod
        Bold Nature
        Level: 99
      `);

      expect(pokemon1.ability).toBe('Lightning Rod');
      expect(pokemon2.ability).toBe('Lightning Rod');
      expect(pokemon1.nature).toBe('Bold');
      expect(pokemon2.nature).toBe('Bold');
      expect(pokemon1.level).toBe(99);
      expect(pokemon2.level).toBe(99);
    });
  });
});
