/**
 * Export to the standard Pokemon text format.
 *
 * Smogonbirb (Talonflame) (F) @ Flyinium Z
 * Ability: Gale Wings
 * EVs: 252 Atk / 4 Def / 252 Spe
 * Jolly Nature
 * - Brave Bird
 * - Flare Blitz
 * - Swords Dance
 * - Roost
 *
 * Full syntax description can be found here:
 * https://pokepast.es/syntax.html
 *
 */
import { Pokemon, Stat, StatsTable } from '@smogon/calc';

const DEFAULT_IV = 31;
const DEFAULT_EV = 0;

const STAT_PRINT_NAMES: { [key in Stat]: string } = {
  hp: 'HP',
  atk: 'Atk',
  def: 'Def',
  spa: 'SpA',
  spd: 'SpD',
  spe: 'Spe',
  spc: 'Spc',
};

const GENDER_PRINT_TEXT = {
  female: ' (F)',
  male: ' (M)',
  genderless: '',
};

function statsAllDefault(defaultValue: number, stats: StatsTable): boolean {
  return Object.values(stats).every(value => value === defaultValue);
}

function printStats(defaultValue: number, stats: StatsTable): string {
  const ivEntries = Object.entries(stats)
    .filter(([, value]) => value !== defaultValue)
    // @ts-ignore: TypeScript can't follow the type of key/value through map.
    .map(([key, value]: [Stat, number]) => `${value} ${STAT_PRINT_NAMES[key]}`, '');
  return ivEntries.join(' / ');
}

export function exportPokemon(pokemon: Pokemon): string {
  const lines = [];

  // Print first line
  let firstLine = '';
  firstLine += pokemon.name;
  if (pokemon.item != null) {
    firstLine += ` @ ${pokemon.item}`;
  }
  lines.push(firstLine);

  // Print ability
  if (pokemon.ability) {
    const abilityLine = `Ability: ${pokemon.ability}`;
    lines.push(abilityLine);
  }

  // Print level
  if (pokemon.level) {
    const levelLine = `Level: ${pokemon.level}`;
    lines.push(levelLine);
  }

  // Print IVs
  if (!statsAllDefault(DEFAULT_IV, pokemon.ivs)) {
    const ivLine = `IVs: ${printStats(DEFAULT_IV, pokemon.ivs)}`;
    lines.push(ivLine);
  }

  // Print EVs
  if (!statsAllDefault(DEFAULT_EV, pokemon.evs)) {
    const evLine = `EVs: ${printStats(DEFAULT_EV, pokemon.evs)}`;
    lines.push(evLine);
  }

  // Print nature
  if (pokemon.nature) {
    const natureLine = `${pokemon.nature} Nature`;
    lines.push(natureLine);
  }

  // Print all learned moves
  pokemon.moves.forEach(move => {
    if (move == null) {
      return;
    }
    const moveLine = `- ${move}`;
    lines.push(moveLine);
  });

  return lines.join('\n');
}
