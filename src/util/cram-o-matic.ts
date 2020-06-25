import { zip } from 'ramda';

type Recipe = [string, string, string, string];

const ANY_ITEM = '__any';

const compareIngredient = (a: string, b: string) => a === ANY_ITEM || b === ANY_ITEM || a === b;

const compareRecipe = (recipeA: Recipe, recipeB: Recipe) => {
  return zip(recipeA, recipeB).every(([a, b]) => compareIngredient(a, b));
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
