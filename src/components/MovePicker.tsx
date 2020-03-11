import React, { ChangeEvent, useState } from 'react';

import { Grid, TextField, Typography } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { calculate, Move, MOVES, Pokemon } from '@smogon/calc';

import { GENERATION } from '../util';

type Props = {
  attacker: Pokemon;
  defender: Pokemon;
};

const printPercent = (numerator: number, denominator: number) =>
  Math.round((numerator / denominator) * 100);

const printHko = (n: number) => `${n === 1 ? 'O' : n}HKO`;

const MovePicker = ({ attacker, defender }: Props) => {
  const [moveName, setMoveName] = useState<string | null>(null);

  const defenderMaxHp = defender.maxHP();

  let description;
  if (moveName) {
    const move = new Move(GENERATION, moveName);
    const result = calculate(GENERATION, attacker, defender, move);
    const damage = result.damage;

    const minDamage = damage[0] * move.hits;
    const maxDamage = damage[damage.length - 1] * move.hits;
    const { chance, n } = result.kochance();

    description =
      `${printPercent(minDamage, defenderMaxHp)}—${printPercent(
        maxDamage,
        defenderMaxHp,
      )}% ${printHko(n)}` +
      (chance != null && chance !== 1 ? ` (${Math.round(chance * 100)}%)` : '');
  }

  return (
    <>
      <Grid item xs={6}>
        <Autocomplete
          style={{ flexGrow: 1 }}
          onChange={(e: ChangeEvent<any>, value: any) => {
            setMoveName(value);
          }}
          options={Object.keys(MOVES[GENERATION])}
          renderInput={params => (
            <TextField {...params} size="small" label="Move" variant="outlined" />
          )}
          value={moveName || ''}
        />
      </Grid>
      <Grid item xs={6} style={{ display: 'flex', alignItems: 'center' }}>
        <Typography>{description}</Typography>
      </Grid>
    </>
  );
};

export default MovePicker;
