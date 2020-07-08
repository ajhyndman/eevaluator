import React, { useState } from 'react';

import { Container, Grid } from '@material-ui/core';
import { ItemName } from '@smogon/calc/dist/data/interface';

import INPUTS from '../assets/cram-o-matic-inputs.json';
import OUTPUTS from '../assets/cram-o-matic-outputs.json';
import { computeRecipe } from '../util/cram-o-matic';
import { SPECIAL_RECIPE_OUTPUTS, validateIngredients } from '../util/cram-o-matic-reverse';
import ItemIcon from './ItemIcon';
import ItemPicker from './ItemPicker';

type Recipe = [ItemName, ItemName, ItemName, ItemName];
type PartialRecipe = [
  ItemName | undefined,
  ItemName | undefined,
  ItemName | undefined,
  ItemName | undefined,
];

const TYPE_NAMES = [
  'Normal',
  'Fighting',
  'Flying',
  'Poison',
  'Ground',
  'Rock',
  'Bug',
  'Ghost',
  'Steel',
  'Fire',
  'Water',
  'Grass',
  'Electric',
  'Psychic',
  'Ice',
  'Dragon',
  'Dark',
  'Fairy',
];

const outputSet = new Set([
  ...(OUTPUTS.flat(2) as string[]).filter((item) => !TYPE_NAMES.includes(item)),
  ...SPECIAL_RECIPE_OUTPUTS,
]);
const outputOptions = [...outputSet];
outputOptions.sort();

const inputOptions = INPUTS.map(([name, type, score]) => name) as ItemName[];
inputOptions.sort();

const getValidOptions = (
  output: string | undefined,
  ingredients: (string | undefined)[],
  index: number,
) => {
  if (output == null) {
    return inputOptions;
  }

  return inputOptions.filter((option) => {
    const ingredientsCopy = ingredients.slice();
    ingredientsCopy[index] = option;
    return validateIngredients(output, ingredientsCopy);
  });
};

const CramOMatic = () => {
  const [output, setOutput] = useState<ItemName>();
  const [inputs, setInputs] = useState<PartialRecipe>([undefined, undefined, undefined, undefined]);

  const outcome = inputs.some((item) => item == null)
    ? undefined
    : computeRecipe(...(inputs as Recipe));

  const handleChangeOutput = (output: ItemName) => {
    setInputs([undefined, undefined, undefined, undefined]);
    setOutput(output);
  };

  const handleChangeInput = (index: number) => (item: ItemName) => {
    setInputs((items) => {
      const nextItems = items.slice();
      nextItems[index] = item;
      return nextItems as PartialRecipe;
    });
  };

  return (
    <Container maxWidth="md" style={{ paddingTop: 16 }}>
      <Grid container alignItems="center" spacing={1}>
        <Grid item xs={12}>
          <ItemPicker
            items={outputOptions}
            item={output}
            label="Goal"
            onChange={handleChangeOutput}
          />
        </Grid>
        <hr />

        {inputs.map((item, i) => (
          <Grid item xs={12}>
            <ItemPicker
              items={getValidOptions(output, inputs, i)}
              item={item}
              label={`Item ${i + 1}`}
              onChange={handleChangeInput(i)}
            />
          </Grid>
        ))}
        <Grid item container xs={12} direction="row" alignItems="center" spacing={1}>
          <Grid item>{outcome && <ItemIcon item={outcome} />}</Grid>
          <Grid item> {outcome}</Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CramOMatic;
