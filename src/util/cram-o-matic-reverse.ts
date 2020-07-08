import OUTPUTS from '../assets/cram-o-matic-outputs.json';
import {
  ANY_ITEM,
  compareRecipe,
  getInputType,
  getOutputsForType,
  getScore,
  Recipe,
} from './cram-o-matic';

const GUARANTEED_RECIPES: { [key: string]: Recipe } = {
  'Big Mushroom': ['Tiny Mushroom', ANY_ITEM, 'Tiny Mushroom', 'Tiny Mushroom'],
  'Big Pearl': ['Pearl', ANY_ITEM, 'Pearl', 'Pearl'],
  'Star Piece': ['Stardust', ANY_ITEM, 'Stardust', 'Stardust'],
  'Balm Mushroom': ['Big Mushroom', ANY_ITEM, 'Big Mushroom', 'Big Mushroom'],
  'Big Bugget': ['Nugget', ANY_ITEM, 'Nugget', 'Nugget'],
  'Pearl String': ['Big Pearl', ANY_ITEM, 'Big Pearl', 'Big Pearl'],
  'Comet Shard': ['Star Piece', ANY_ITEM, 'Star Piece', 'Star Piece'],
  'Ability Capsule': ['Rare Candy', ANY_ITEM, 'Rare Candy', 'Rare Candy'],
  'Gold Bottle Cap': ['Bottle Cap', ANY_ITEM, 'Bottle Cap', 'Bottle Cap'],
};
export const GUARANTEED_RECIPE_OUTPUTS = Object.keys(GUARANTEED_RECIPES);

export const getOutputType = (output: string) => {
  const [type] = OUTPUTS.find(([type, outputs]) => outputs.includes(output));
  return type as string;
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

  // If output belongs a "Fixed recipe", accept or .
  if (GUARANTEED_RECIPE_OUTPUTS.includes(output)) {
    const matchesFixedRecipe = compareRecipe(
      recipe.map((item) => (item == null ? ANY_ITEM : item)) as Recipe,
      GUARANTEED_RECIPES[output],
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

  return true;
};
