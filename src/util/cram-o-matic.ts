import { zip } from 'ramda';

import INPUTS from '../assets/cram-o-matic-inputs.json';
import OUTPUTS from '../assets/cram-o-matic-outputs.json';

type Recipe = [string, string, string, string];
type Range = [number, number];

const ANY_ITEM = '__any';
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

const compareRecipe = (recipeA: Recipe, recipeB: Recipe) => {
  return zip(recipeA, recipeB).every(([a, b]) => compareIngredient(a, b));
};

const getResult = (type: string, score: number) => {
  const outputsForType = OUTPUTS_WITH_RANGES.find(([rowType]) => rowType === type);
  if (outputsForType == null) {
    throw new Error(`No outputs found for type: ${type}`);
  }

  const outputRow = outputsForType[1].find(
    ([[lowerBound, upperBound]]) => lowerBound <= score && score <= upperBound,
  );
  if (outputRow == null) {
    throw new Error(`No output found for type: ${type} and score: ${score}`);
  }

  return outputRow[1];
};

const GUARANTEED_RECIPES = new Map<Recipe, string>([
  [['Tiny Mushroom', ANY_ITEM, 'Tiny Mushroom', 'Tiny Mushroom'], 'Big Mushroom'],
  [['Pearl', ANY_ITEM, 'Pearl', 'Pearl'], 'Big Pearl'],
  [['Stardust', ANY_ITEM, 'Stardust', 'Stardust'], 'Star Piece'],
  [['Big Mushroom', ANY_ITEM, 'Big Mushroom', 'Big Mushroom'], 'Balm Mushroom'],
  [['Nugget', ANY_ITEM, 'Nugget', 'Nugget'], 'Big Bugget'],
  [['Big Pearl', ANY_ITEM, 'Big Pearl', 'Big Pearl'], 'Pearl String'],
  [['Star Piece', ANY_ITEM, 'Star Piece', 'Star Piece'], 'Comet Shard'],
  [['Rare Candy', ANY_ITEM, 'Rare Candy', 'Rare Candy'], 'Ability Capsule'],
  [['Bottle Cap', ANY_ITEM, 'Bottle Cap', 'Bottle Cap'], 'Gold Bottle Cap'],
]);

export const computeGuaranteedRecipe = (...items: Recipe) => {
  for (const [guaranteedRecipe, result] of GUARANTEED_RECIPES) {
    if (compareRecipe(items, guaranteedRecipe)) {
      return result;
    }
  }

  throw new Error('unknown recipe');
};

const getInput = (item: string) => {
  const input = INPUTS.find(([name]) => name === item);
  if (input == null) {
    throw new Error(`Didn't recognize item: ${item}`);
  }
  return input as [string, string, string];
};

export const computeGeneralRecipe = (...items: Recipe) => {
  // get type
  const typeItem = items[0];
  const type = getInput(typeItem)[1];

  if (type == null) {
    throw new Error(`did not recognize type of ${typeItem}`);
  }

  // get score
  const score = items.reduce((acc, item) => {
    const input = getInput(item);
    const score = input[2];
    return acc + parseInt(score);
  }, 0);

  // get result
  return getResult(type, score);
};
