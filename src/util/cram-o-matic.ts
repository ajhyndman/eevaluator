import { zip } from 'ramda';

import INPUTS from '../assets/cram-o-matic-inputs.json';
import OUTPUTS from '../assets/cram-o-matic-outputs.json';

export type Recipe = [string, string, string, string];
export type Range = [number, number];

export const ANY_ITEM = '__any';
const OUTPUT_RANGES = [
  [2, 20],
  [22, 30],
  [32, 40],
  [42, 50],
  [52, 60],
  [62, 70],
  [72, 80],
  [82, 90],
  [92, 100],
  [102, 110],
  [112, 120],
  [122, 130],
  [132, 140],
  [142, 150],
  [152, 160],
];

// @ts-ignore: zip's KeyValuePair is incompatible with tuple?
const OUTPUTS_WITH_RANGES: [string, Array<[Range, string]>][] = (OUTPUTS as [
  string,
  string[],
][]).map(([type, outputs]) => [type, zip(OUTPUT_RANGES, outputs)]);

const compareIngredient = (a: string, b: string) => a === ANY_ITEM || b === ANY_ITEM || a === b;

export const compareRecipe = (recipeA: Recipe, recipeB: Recipe) => {
  return zip(recipeA, recipeB).every(([a, b]) => compareIngredient(a, b));
};

export const getScore = (...items: string[]): number => {
  return items.reduce((acc, item) => {
    const input = getInput(item);
    const score = input[2];
    return acc + parseInt(score);
  }, 0);
};

export const getOutputsForType = (type: string) => {
  const outputsForType = OUTPUTS_WITH_RANGES.find(([rowType]) => rowType === type);
  if (outputsForType == null) {
    throw new Error(`No outputs found for type: ${type}`);
  }
  return outputsForType[1];
};

const getResult = (type: string, score: number) => {
  const outputsForType = getOutputsForType(type);

  const outputRow = outputsForType.find(
    ([[lowerBound, upperBound]]) => lowerBound <= score && score <= upperBound,
  );
  if (outputRow == null) {
    throw new Error(`No output found for type: ${type} and score: ${score}`);
  }

  return outputRow[1];
};

const SPECIAL_RECIPES = new Map<Recipe, string>([
  [['Rare Candy', ANY_ITEM, 'Rare Candy', 'Rare Candy'], 'Ability Capsule'],
  [['Big Mushroom', ANY_ITEM, 'Big Mushroom', 'Big Mushroom'], 'Balm Mushroom'],
  [['Tiny Mushroom', ANY_ITEM, 'Tiny Mushroom', 'Tiny Mushroom'], 'Big Mushroom'],
  [['Nugget', ANY_ITEM, 'Nugget', 'Nugget'], 'Big Nugget'],
  [['Pearl', ANY_ITEM, 'Pearl', 'Pearl'], 'Big Pearl'],
  [['Star Piece', ANY_ITEM, 'Star Piece', 'Star Piece'], 'Comet Shard'],
  [['Bottle Cap', ANY_ITEM, 'Bottle Cap', 'Bottle Cap'], 'Gold Bottle Cap'],
  [['Big Pearl', ANY_ITEM, 'Big Pearl', 'Big Pearl'], 'Pearl String'],
  [['Armorite Ore', ANY_ITEM, 'Armorite Ore', 'Armorite Ore'], 'PP Up'],
  [['Stardust', ANY_ITEM, 'Stardust', 'Stardust'], 'Star Piece'],
]);

export const computeSpecialRecipe = (...items: Recipe) => {
  for (const [specialRecipe, result] of SPECIAL_RECIPES) {
    if (compareRecipe(items, specialRecipe)) {
      return result;
    }
  }

  throw new Error('unknown recipe');
};

export const getInput = (item: string) => {
  const input = INPUTS.find(([name]) => name === item);
  if (input == null) {
    throw new Error(`Didn't recognize item: ${item}`);
  }
  return input as [string, string, string];
};

export const getInputType = (ingredient: string) => {
  const input = getInput(ingredient);
  return input[1];
};

export const computeGeneralRecipe = (...items: Recipe) => {
  // get type
  const typeItem = items[0];
  const type = getInputType(typeItem);

  // get score
  const score = getScore(...items);

  // get result
  return getResult(type, score);
};

export const computeRecipe = (...items: Recipe) => {
  try {
    return computeSpecialRecipe(...items);
  } catch (e) {
    // console.debug('recipe didn\'t match "special" recipe — falling back to general recipes');
  }
  return computeGeneralRecipe(...items);
};
