import Head from 'next/head';
import React, { useState } from 'react';

import { Container, Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { ItemName } from '@smogon/calc/dist/data/interface';

import INPUTS from '../../assets/cram-o-matic-inputs.json';
import OUTPUTS from '../../assets/cram-o-matic-outputs.json';
import ItemIcon from '../../components/ItemIcon';
import ItemPicker from '../../components/ItemPicker';
import { computeRecipe, POKE_BALL } from '../../util/cram-o-matic';
import { SPECIAL_RECIPE_OUTPUTS, validateIngredients } from '../../util/cram-o-matic-reverse';

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
    <>
      <Head>
        <title>Cram-O-Matic :: Eevaluator</title>
        <meta
          name="description"
          content="Learn how to get every item you need from the Pokemon Sword &amp; Shield: Isle of Armor expansion's Cram-O-Matic.  Computes all possible recipes for each available output."
        />
        <meta property="og:title" content="Cram-O-Matic :: Eevaluator" />
        <meta
          property="og:description"
          content="Learn how to get every item you need from the Pokemon Sword &amp; Shield: Isle of Armor expansion's Cram-O-Matic.  Computes all possible recipes for each available output."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_URL}/cram-o-matic/`} />
        <meta
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_URL}/cram-o-matic-preview.png`}
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="1200" />
        <meta
          property="og:image:alt"
          content="Four select fields have three Bottlecaps and one Aguav berry selected. Text below reads: You got a Gold Bottlecap."
        />
      </Head>
      <Container maxWidth="md" style={{ paddingTop: 16 }}>
        <Grid container alignItems="stretch" spacing={2}>
          <Grid item xs={12} md={4} container direction="column" spacing={1}>
            <Grid item>
              <Typography variant="h6" gutterBottom>
                What would you like to get?
              </Typography>
            </Grid>
            <Grid item style={{ flexGrow: 1 }} container alignItems="center">
              <ItemPicker
                items={outputOptions}
                item={output}
                label="Filter by Goal"
                onChange={handleChangeOutput}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} md={4} container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Pick some ingredients
              </Typography>
            </Grid>
            {inputs.map((item, i) => (
              <Grid key={i} item xs={12}>
                <ItemPicker
                  items={getValidOptions(output, inputs, i)}
                  item={item}
                  label={`Item ${i + 1}`}
                  onChange={handleChangeInput(i)}
                />
              </Grid>
            ))}
          </Grid>
          <Grid item xs={12} md={4} container direction="column" justify="flex-start" spacing={1}>
            <Grid item>
              <Typography variant="h6">You got:</Typography>
            </Grid>
            <Grid item container alignItems="center" spacing={1} style={{ flexGrow: 1 }}>
              <Grid item>
                {outcome && <ItemIcon item={outcome === POKE_BALL ? 'Poke Ball' : outcome} />}
              </Grid>
              <Grid item>
                {/* <div style={{ width: 8 }} /> */}
                <Typography component="strong" style={{ fontSize: '1.25em' }}>
                  {outcome}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default CramOMatic;
