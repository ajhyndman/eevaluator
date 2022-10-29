import ReactGA from 'react-ga';

import { Generations, NATURES, Pokemon, State } from '@smogon/calc';
import { NatureName, StatName } from '@smogon/calc/dist/data/interface';

export const GENERATION = Generations.get(8);
export const STAT_LABEL: { [key in StatName]: string } = {
  atk: 'Attack',
  def: 'Defense',
  hp: 'HP',
  spa: 'Sp. Atk',
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
export const clonePokemon = (
  pokemon: Pokemon,
  options: Partial<State.Pokemon & { curHP: number; overrides: any }>,
) => new Pokemon(GENERATION, pokemon.name, { ...pokemon, overrides: pokemon.species, ...options });

/**
 * A reverse lookup helper.  Given a pair of benefitted and hindered stats,
 * retrieve the name of the associated nature.
 *
 * @param plusStat The stat key for the nature-benefitted stat.
 * @param minusStat The stat key for the nature-hindered stat.
 * @returns The name of the matching nature, as a string.
 */
export const getNature = (plusStat?: StatName, minusStat?: StatName): NatureName => {
  return Object.keys(NATURES).find((name: string) => {
    const [a, b] = NATURES[name];
    return a === plusStat && b === minusStat;
  })! as NatureName;
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

/**
 * Transform a polar coordinate to a cartesian coordinate.
 *
 * @example
 * // r = 1, θ = 0 -> x = 1, y = 0
 * polarToCartesian([1, 0]) // = [1, 0]
 *
 * // r = 1, θ = π/2 -> x = 0, y = 1
 * polarToCartesian([1, Math.PI / 2]) // = [0, 1]
 *
 * // r = 1, θ = π -> x = -1, y = 0
 * polarToCartesian([1, Math.PI]) // = [-1, 0]
 *
 * @param polarCoordinate A polar coordinate of the form [r, θ] (theta should be
 * supplied in radians)
 * @returns A cartesian coordinate of the form [x, y]
 */
export const polarToCartesian = ([radius, angle]: [number, number]) => [
  Math.sin(angle) * radius,
  -Math.cos(angle) * radius,
];
