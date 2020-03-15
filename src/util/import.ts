/**
 * Import from the standard Pokemon text format.
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
  firstLine?: {
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

const matchBlankLine = /^\s*$/;
const matchFirstLine = /^\s*([^()]*?)\s*(?:\(([^()]{2,}?)\))?\s*(?:\(([MF])\))?\s*(?:@\s*(.*?))?\s*$/i;
const matchLevelLine = /^\s*Level:\s*(\d{1,3})\s*$/i;
const matchAbilityLine = /^\s*Ability:\s*(.*?)\s*$/i;
const matchEvLine = /^\s*EVs:\s*((?:\d{1,3}\s*(?:HP|Atk|Def|SpA|SpD|Spe)\s*\/?\s*){0,6})$/i;
const matchIvLine = /^\s*IVs:\s*((?:\d{1,3}\s*(?:HP|Atk|Def|SpA|SpD|Spe)\s*\/?\s*){0,6})$/i;
const matchNatureLine = /^\s*(.*?)\s*Nature\s*$/i;
const matchHappinessLine = /^\s*Happiness:\s*(\d{1,3})$/i;
const matchShinyLine = /^\s*Shiny:\s*(Yes|No)\s*$/i;
const matchMoveLine = /^\s*-\s*(.*?)\s*$/i;

function lineMatches(condition: boolean, matcher: RegExp, line: string): boolean {
  return condition && matcher.test(line);
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
  const lines = text.split('\n');

  const config: PokemonConfiguration = {
    moves: [],
  };

  while (lines.length > 0) {
    const line = lines.shift()!;

    // blank lines are always ignored
    if (matchBlankLine.test(line)) {
      continue;
    }

    // if not already found, only accept first line
    if (config.firstLine == null) {
      const result = matchFirstLine.exec(line);
      if (result == null) {
        throw new Error('Pokemon text must always start with name');
      }
      const [, name1, name2, gender, item] = result;
      config.firstLine = {
        species: name2 || name1,
        nickname: name2 ? name1 : undefined,
        gender: gender != null ? GENDER_NAMES[gender.toLocaleUpperCase() as 'M' | 'F'] : undefined,
        item: item,
      };
      continue;
    }

    // remaining lines may be parsed in any order

    // if not already parsed, accept evs
    if (lineMatches(config.evs == null, matchEvLine, line)) {
      const [, statText] = matchEvLine.exec(line)!;
      config.evs = parseStatText(statText);
      continue;
    }

    // // if not already parsed, accept ivs
    if (lineMatches(config.ivs == null, matchIvLine, line)) {
      const [, statText] = matchIvLine.exec(line)!;
      config.ivs = parseStatText(statText);
      continue;
    }

    // if not already parsed, accept level
    if (lineMatches(config.level == null, matchLevelLine, line)) {
      const [, level] = matchLevelLine.exec(line)!;
      config.level = parseInt(level);
      continue;
    }

    // if not already parsed, accept ability
    if (lineMatches(config.ability == null, matchAbilityLine, line)) {
      const [, ability] = matchAbilityLine.exec(line)!;
      config.ability = ability;
      continue;
    }

    // if not already parsed, accept nature
    if (lineMatches(config.nature == null, matchNatureLine, line)) {
      const [, nature] = matchNatureLine.exec(line)!;
      config.nature = nature;
      continue;
    }

    // if not already parsed, accept happiness line
    if (lineMatches(config.happiness == null, matchHappinessLine, line)) {
      const [, happiness] = matchHappinessLine.exec(line)!;
      config.happiness = parseInt(happiness);
      continue;
    }

    // if not already parsed, accept shiny line
    if (lineMatches(config.shiny == null, matchShinyLine, line)) {
      const [, shiny] = matchShinyLine.exec(line)!;
      config.shiny = shiny.toLocaleLowerCase() === 'yes';
      continue;
    }

    // if four moves have not already been parsed, accpet move line
    if (lineMatches(config.moves.length < 4, matchMoveLine, line)) {
      const [, move] = matchMoveLine.exec(line)!;
      config.moves.push(move);
      continue;
    }

    throw new Error('Line could not be matched');
  }

  if (config.firstLine == null) {
    throw new Error('No pokemon data found');
  }

  return new Pokemon(GENERATION, config.firstLine.species, {
    level: config.level,
    ability: config.ability,
    item: config.firstLine.item,
    evs: config.evs,
    ivs: config.ivs,
    moves: config.moves,
    nature: config.nature,
    gender: config.firstLine.gender,
  });
}
