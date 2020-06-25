import React, { useState } from 'react';

import { Container, Grid } from '@material-ui/core';
import { ItemName } from '@smogon/calc/dist/data/interface';

import INPUTS from '../assets/cram-o-matic-inputs.json';
import { computeRecipe } from '../util/cram-o-matic';
import ItemIcon from './ItemIcon';
import ItemPicker from './ItemPicker';

const CramOMatic = () => {
  const [item1, setItem1] = useState<ItemName>();
  const [item2, setItem2] = useState<ItemName>();
  const [item3, setItem3] = useState<ItemName>();
  const [item4, setItem4] = useState<ItemName>();

  const options = INPUTS.map(([name, type, score]) => name) as ItemName[];

  const items = [item1, item2, item3, item4];
  const outcome = items.some((item) => item == null)
    ? undefined
    : computeRecipe(item1!, item2!, item3!, item4!);

  return (
    <Container maxWidth="md" style={{ paddingTop: 16 }}>
      <Grid container alignItems="center" spacing={1}>
        <Grid item xs={12}>
          <ItemPicker items={options} item={item1} onChange={setItem1} />
        </Grid>
        <Grid item xs={12}>
          <ItemPicker items={options} item={item2} onChange={setItem2} />
        </Grid>
        <Grid item xs={12}>
          <ItemPicker items={options} item={item3} onChange={setItem3} />
        </Grid>
        <Grid item xs={12}>
          <ItemPicker items={options} item={item4} onChange={setItem4} />
        </Grid>
        <Grid item container xs={12} direction="row" alignItems="center" spacing={1}>
          <Grid item>{outcome && <ItemIcon item={outcome} />}</Grid>
          <Grid item> {outcome}</Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CramOMatic;
