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

import { GENERATION } from './util';

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
    if (config.evs == null) {
      const result = matchEvRow.exec(row);
      if (result != null) {
        const [, stats] = result;
        if (!stats.trim()) {
          continue;
        }
        config.evs = stats.split('/').reduce((acc, statString) => {
          const [value, key] = statString.trim().split(/\s+/);
          return { ...acc, [key.toLocaleLowerCase() as Stat]: clamp(0, 255, parseInt(value)) };
        }, {});
        continue;
      }
    }

    // if not already parsed, accept ivs
    if (config.ivs == null) {
      const result = matchIvRow.exec(row);
      if (result != null) {
        const [, stats] = result;
        if (!stats.trim()) {
          continue;
        }
        config.ivs = stats.split('/').reduce((acc, statString) => {
          const [value, key] = statString.trim().split(/\s+/);
          return { ...acc, [key.toLocaleLowerCase() as Stat]: clamp(0, 31, parseInt(value)) };
        }, {});
        continue;
      }
    }

    // if not already parsed, accept level
    if (config.level == null) {
      const result = matchLevelRow.exec(row);
      if (result != null) {
        const [, level] = result;
        config.level = parseInt(level);
        continue;
      }
    }

    // if not already parsed, accept ability
    if (config.ability == null) {
      const result = matchAbilityRow.exec(row);
      if (result != null) {
        const [, ability] = result;
        config.ability = ability;
        continue;
      }
    }

    // if not already parsed, accept nature
    if (config.nature == null) {
      const result = matchNatureRow.exec(row);
      if (result != null) {
        const [, nature] = result;
        config.nature = nature;
        continue;
      }
    }

    // if not already parsed, accept happiness row
    if (config.happiness == null) {
      const result = matchHappinessRow.exec(row);
      if (result != null) {
        const [, happiness] = result;
        config.happiness = parseInt(happiness);
        continue;
      }
    }

    // if not already parsed, accept shiny row
    if (config.shiny == null) {
      const result = matchShinyRow.exec(row);
      if (result != null) {
        const [, shiny] = result;
        config.shiny = shiny.toLocaleLowerCase() === 'yes';
        continue;
      }
    }

    // if four moves have not already been parsed, accpet move row
    if (config.moves.length < 4) {
      const result = matchMoveRow.exec(row);
      if (result != null) {
        const [, move] = result;
        config.moves.push(move);
        continue;
      }
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
