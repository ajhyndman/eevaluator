/**
 * Import and export from the standard Pokemon text format.
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
import { clamp } from 'ramda';

import { Pokemon, Stat, StatsTable } from '@smogon/calc';

import { GENERATION } from './misc';

type PokemonConfiguration = {
  firstRow?: {
    gender?: 'female' | 'male';
    item?: string;
    nickname?: string;
    species: string;
  };
  ability?: string;
  level?: number;
  nature?: string;
  evs?: Partial<StatsTable>;
  ivs?: Partial<StatsTable>;
  happiness?: number;
  shiny?: boolean;
  moves: string[];
};

const GENDER_NAMES = {
  M: 'male' as 'male',
  F: 'female' as 'female',
};

// To debug or experiment with regex in this file, I recommend using a railroad
// diagram visualizer, such as: https://regexper.com/

const matchBlankRow = /^\s*$/;
const matchFirstRow = /^\s*([^()]*?)\s*(?:\(([^()]{2,}?)\))?\s*(?:\(([MF])\))?\s*(?:@\s*(.*))?\s*$/i;
const matchLevelRow = /^\s*Level:\s*(\d{1,3})\s*$/i;
const matchAbilityRow = /^\s*Ability:\s*(.*?)\s*$/i;
const matchEvRow = /^\s*EVs:\s*((?:\d{1,3}\s*(?:HP|Atk|Def|SpA|SpD|Spe)\s*\/?\s*){0,6})$/i;
const matchIvRow = /^\s*IVs:\s*((?:\d{1,3}\s*(?:HP|Atk|Def|SpA|SpD|Spe)\s*\/?\s*){0,6})$/i;
const matchNatureRow = /^\s*(.*?)\s*Nature\s*$/i;
const matchHappinessRow = /^\s*Happiness:\s*(\d{1,3})$/i;
const matchShinyRow = /^\s*Shiny:\s*(Yes|No)\s*$/i;
const matchMoveRow = /^\s*-\s*(.*?)\s*$/i;

function rowMatches(condition: boolean, matcher: RegExp, row: string): boolean {
  return condition && matcher.test(row);
}

/**
 * Parse a string containing stat values into a partial StatsTable
 *
 * @example
 * parseStatText('0 Atk / 0 Spd') // => { atk: 0, spd: 0 }
 */
function parseStatText(statsText: string): Partial<StatsTable> {
  if (!statsText.trim()) {
    // if string is only whitespace, return
    return {};
  }
  // statEntries should look like: ['0 Atk', '0 Spd']
  const statEntries = statsText.split('/');
  // reduce list into object map
  return statEntries.reduce((acc, statEntry) => {
    const [value, key] = statEntry.trim().split(/\s+/);
    const normalizedKey = key.toLocaleLowerCase() as Stat;
    return { ...acc, [normalizedKey]: clamp(0, 255, parseInt(value)) };
  }, {});
}

export function importPokemon(text: string): Pokemon {
  const rows = text.split('\n');

  const config: PokemonConfiguration = {
    moves: [],
  };

  while (rows.length > 0) {
    const row = rows.shift()!;

    // blank lines are always ignored
    if (matchBlankRow.test(row)) {
      continue;
    }

    // if not already found, only accept first row
    if (config.firstRow == null) {
      const result = matchFirstRow.exec(row);
      if (result == null) {
        throw new Error('Pokemon text must always start with name');
      }
      const [, name1, name2, gender, item] = result;
      config.firstRow = {
        species: name2 || name1,
        nickname: name2 ? name1 : undefined,
        gender: gender != null ? GENDER_NAMES[gender.toLocaleUpperCase() as 'M' | 'F'] : undefined,
        item: item,
      };
      continue;
    }

    // remaining rows may be parsed in any order

    // if not already parsed, accept evs
    if (rowMatches(config.evs == null, matchEvRow, row)) {
      const [, statText] = matchEvRow.exec(row)!;
      config.evs = parseStatText(statText);
      continue;
    }

    // // if not already parsed, accept ivs
    if (rowMatches(config.ivs == null, matchIvRow, row)) {
      const [, statText] = matchIvRow.exec(row)!;
      config.ivs = parseStatText(statText);
      continue;
    }

    // if not already parsed, accept level
    if (rowMatches(config.level == null, matchLevelRow, row)) {
      const [, level] = matchLevelRow.exec(row)!;
      config.level = parseInt(level);
      continue;
    }

    // if not already parsed, accept ability
    if (rowMatches(config.ability == null, matchAbilityRow, row)) {
      const [, ability] = matchAbilityRow.exec(row)!;
      config.ability = ability;
      continue;
    }

    // if not already parsed, accept nature
    if (rowMatches(config.nature == null, matchNatureRow, row)) {
      const [, nature] = matchNatureRow.exec(row)!;
      config.nature = nature;
      continue;
    }

    // if not already parsed, accept happiness row
    if (rowMatches(config.happiness == null, matchHappinessRow, row)) {
      const [, happiness] = matchHappinessRow.exec(row)!;
      config.happiness = parseInt(happiness);
      continue;
    }

    // if not already parsed, accept shiny row
    if (rowMatches(config.shiny == null, matchShinyRow, row)) {
      const [, shiny] = matchShinyRow.exec(row)!;
      config.shiny = shiny.toLocaleLowerCase() === 'yes';
      continue;
    }

    // if four moves have not already been parsed, accpet move row
    if (rowMatches(config.moves.length < 4, matchMoveRow, row)) {
      const [, move] = matchMoveRow.exec(row)!;
      config.moves.push(move);
      continue;
    }

    throw new Error('Row could not be matched');
  }

  if (config.firstRow == null) {
    throw new Error('No pokemon data found');
  }

  return new Pokemon(GENERATION, config.firstRow.species, {
    level: config.level,
    ability: config.ability,
    item: config.firstRow.item,
    evs: config.evs,
    ivs: config.ivs,
    moves: config.moves,
    nature: config.nature,
    gender: config.firstRow.gender,
  });
}
