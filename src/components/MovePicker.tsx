import React, { ChangeEvent, useState } from 'react';

import { Grid, TextField, Typography } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { calculate, Move, MOVES, Pokemon } from '@smogon/calc';

import { GENERATION } from '../util';
import TypeIcon from './TypeIcon';

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
  let move: Move | undefined;
  if (moveName) {
    move = new Move(GENERATION, moveName, { useMax: attacker.isDynamaxed });
    const result = calculate(GENERATION, attacker, defender, move);
    const damage = result.damage;

    if (damage.length > 1) {
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
            <TextField
              {...{
                ...params,
                InputProps: {
                  ...params.InputProps,
                  startAdornment: move && <TypeIcon size="small" type={move.type} />,
                },
              }}
              size="small"
              label="Move"
              variant="outlined"
            />
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
