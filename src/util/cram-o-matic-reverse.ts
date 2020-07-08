import OUTPUTS from '../assets/cram-o-matic-outputs.json';
import {
  ANY_ITEM,
  compareRecipe,
  getInputType,
  getOutputsForType,
  getScore,
  Recipe,
} from './cram-o-matic';

const SPECIAL_RECIPES: { [key: string]: Recipe } = {
  'Ability Capsule': ['Rare Candy', ANY_ITEM, 'Rare Candy', 'Rare Candy'],
  'Balm Mushroom': ['Big Mushroom', ANY_ITEM, 'Big Mushroom', 'Big Mushroom'],
  'Big Nugget': ['Nugget', ANY_ITEM, 'Nugget', 'Nugget'],
  'Big Mushroom': ['Tiny Mushroom', ANY_ITEM, 'Tiny Mushroom', 'Tiny Mushroom'],
  'Big Pearl': ['Pearl', ANY_ITEM, 'Pearl', 'Pearl'],
  'Comet Shard': ['Star Piece', ANY_ITEM, 'Star Piece', 'Star Piece'],
  'Gold Bottle Cap': ['Bottle Cap', ANY_ITEM, 'Bottle Cap', 'Bottle Cap'],
  'Pearl String': ['Big Pearl', ANY_ITEM, 'Big Pearl', 'Big Pearl'],
  'PP Up': ['Armorite Ore', ANY_ITEM, 'Armorite Ore', 'Armorite Ore'],
  'Star Piece': ['Stardust', ANY_ITEM, 'Stardust', 'Stardust'],
};
export const SPECIAL_RECIPE_OUTPUTS = Object.keys(SPECIAL_RECIPES);

export const getOutputType = (output: string) => {
  const outputRow = OUTPUTS.find(([type, outputs]) => outputs.includes(output));
  if (outputRow == null) {
    throw new Error(`Output not recognized: ${output}`);
  }
  return outputRow[0] as string;
};

const getOutputRange = (output: string) => {
  const type = getOutputType(output);
  const outputsForType = getOutputsForType(type);
  const outputRow = outputsForType.find(([, name]) => name === output);
  if (outputRow == null) {
    throw new Error(`No output found for type: ${type} and name: ${output}`);
  }
  return outputRow[0];
};

export const validateIngredients = (
  output: string,
  ingredients: (string | undefined)[],
): boolean => {
  // take exactly four values from ingredients
  const recipe = [ingredients[0], ingredients[1], ingredients[2], ingredients[3]] as const;

  try {
    // If output belongs a "Fixed recipe", accept or .
    if (SPECIAL_RECIPE_OUTPUTS.includes(output)) {
      const matchesFixedRecipe = compareRecipe(
        recipe.map((item) => (item == null ? ANY_ITEM : item)) as Recipe,
        SPECIAL_RECIPES[output],
      );

      if (matchesFixedRecipe) {
        return true;
      }
    }

    // If first ingredient is the wrong type, reject.
    const outputType = getOutputType(output);
    if (recipe[0] != null && outputType !== getInputType(recipe[0])) {
      return false;
    }

    // If score is unattainable, reject.
    const nonEmptyIngredients = recipe.filter((item) => item != null) as string[];
    const numMissingIngredients = 4 - nonEmptyIngredients.length;
    const currentScore = getScore(...nonEmptyIngredients);
    const [min, max] = getOutputRange(output);
    if (currentScore > max) {
      return false;
    }
    if (currentScore + numMissingIngredients * 40 < min) {
      return false;
    }
  } catch (e) {
    console.debug(e);
    return false;
  }

  return true;
};