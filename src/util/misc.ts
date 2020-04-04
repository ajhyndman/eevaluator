import ReactGA from 'react-ga';

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

const PROPERTY_ID = 'UA-97182834-3';

export const GITHUB_URL = 'https://github.com/ajhyndman/visual-pokemon-calc/issues/1';

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

export const writeToLocalStorage = (key: string, payload: any) => {
  const jsonString = JSON.stringify(payload);

  if (window.localStorage) {
    window.localStorage.setItem(key, jsonString);
  }
};

export const readFromLocalStorage = (key: string): any => {
  if (window.localStorage) {
    const jsonString = window.localStorage.getItem(key);
    if (jsonString == null) {
      return;
    }
    return JSON.parse(jsonString);
  }
};

export const pageview = () => {
  if (window.location.hostname !== 'localhost') {
    ReactGA.initialize(PROPERTY_ID);
    ReactGA.pageview(window.location.pathname);
  }
};

export const polarToCartesian = ([radius, angle]: [number, number]) => [
  Math.sin(angle) * radius,
  -Math.cos(angle) * radius,
];
