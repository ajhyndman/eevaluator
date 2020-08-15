import React, { useState } from 'react';

import { Grid } from '@material-ui/core';
import { Field, Pokemon } from '@smogon/calc';

import MovePicker from '../components/MovePicker';
import { GENERATION } from '../util/misc';

export default {
  title: 'MovePicker',
  component: MovePicker,
  decorators: [
    (story: any) => (
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        {story()}
      </div>
    ),
  ],
};

const PIKACHU = new Pokemon(GENERATION, 'Pikachu');
const FIELD = new Field();
const INITIAL_MOVE = 'Thunderbolt';

export const SingleInput = () => {
  const [move, setMove] = useState<string | undefined>(INITIAL_MOVE);
  return (
    <>
      <Grid container spacing={1} style={{ width: 448 }}>
        <MovePicker
          move={move}
          onChangeMove={setMove}
          index={1}
          attacker={PIKACHU}
          defender={PIKACHU}
          field={FIELD}
        />
      </Grid>
      <div style={{ height: 8 }} />
      <Grid container spacing={1} style={{ width: 390 }}>
        <MovePicker
          move={move}
          onChangeMove={setMove}
          index={1}
          attacker={PIKACHU}
          defender={PIKACHU}
          field={FIELD}
        />
      </Grid>
    </>
  );
};
