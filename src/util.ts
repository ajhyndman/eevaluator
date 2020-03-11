import { NATURES, Pokemon, Stat } from '@smogon/calc';

export const GENERATION = 8;

export const STAT_LABEL: { [key in Stat]: string } = {
  atk: 'Attack',
  def: 'Defense',
  hp: 'HP',
  spa: 'Sp. Atk',
  spc: 'Special',
  spd: 'Sp. Def',
  spe: 'Speed',
};

/**
 * Creates a new pokemon with the properties of the first pokemon merged with
 * the properties of the options configuration.  If a key exists in both
 * objects, the value from the options object will be used.
 */
export const clonePokemon = (pokemon: Pokemon, options: Partial<Pokemon>) =>
  new Pokemon(GENERATION, pokemon.name, { ...pokemon, ...options });

export const getNature = (plusStat?: Stat, minusStat?: Stat) => {
  return Object.keys(NATURES).find((name: string) => {
    const [a, b] = NATURES[name];
    return a === plusStat && b === minusStat;
  })!;
};

export const writeToLocalStorage = (key: string, pokemon: Pokemon) => {
  const jsonString = JSON.stringify(pokemon);

  if (window.localStorage) {
    window.localStorage.setItem(key, jsonString);
  }
};

export const readFromLocalStorage = (key: string) => {
  if (window.localStorage) {
    const jsonString = window.localStorage.getItem(key);
    if (jsonString == null) {
      return;
    }
    const json = JSON.parse(jsonString);
    return new Pokemon(GENERATION, json.name, json);
  }
};
