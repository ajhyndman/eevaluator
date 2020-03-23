import { drop, pickBy } from 'ramda';
import React, { ChangeEvent } from 'react';

import { Grid, TextField, Typography } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { calculate, Field, Move, MOVES, Pokemon } from '@smogon/calc';
import { getMaxMoveName, MoveData } from '@smogon/calc/dist/data/moves';

import { GENERATION } from '../util/misc';
import TypeIcon from './TypeIcon';

type Props = {
  index: number;
  move?: string;
  onChangeMove: (move: string | undefined) => void;
  attacker: Pokemon;
  defender: Pokemon;
};

export const USEFUL_MOVES: { string: MoveData } = pickBy(
  move => !(move.isMax || move.category === 'Status' || move.category == null),
  MOVES[GENERATION],
);

const printPercent = (numerator: number, denominator: number) =>
  Math.round((numerator / denominator) * 100);

const printRange = (minDamage: number, maxDamage: number, maxHp: number) => {
  if (minDamage === maxDamage) {
    return `${printPercent(maxDamage, maxHp)}%`;
  }
  return `${printPercent(minDamage, maxHp)}—${printPercent(maxDamage, maxHp)}%`;
};

const printHko = (n: number) => `${n === 1 ? 'O' : n}HKO`;

const MovePicker = ({ index, attacker, defender, move: moveName, onChangeMove }: Props) => {
  const defenderMaxHp = defender.maxHP();

  let description;
  let move: Move | undefined;
  if (moveName) {
    move = new Move(GENERATION, moveName, { useMax: attacker.isDynamaxed });
    const result = calculate(
      GENERATION,
      attacker,
      defender,
      move,
      new Field({ gameType: 'Doubles' }),
    );
    const damage = result.damage;

    if (damage.some(value => value !== 0)) {
      const minDamage = damage[0] * move.hits;
      const maxDamage = damage[damage.length - 1] * move.hits;
      const { chance, n } = result.kochance();

      description =
        printRange(minDamage, maxDamage, defenderMaxHp) +
        (n > 0 ? ` ${printHko(n)}` : '') +
        (chance != null && chance !== 1 && chance !== 0 ? ` (${Math.round(chance * 100)}%)` : '');
    }
  }

  const moveDisplayName =
    move == null
      ? ''
      : attacker.isDynamaxed
      ? getMaxMoveName(move.type, attacker.name, move.category === 'Status')
      : moveName;

  return (
    <>
      <Grid item xs={6}>
        <Autocomplete
          style={{ flexGrow: 1 }}
          onChange={(e: ChangeEvent<any>, value: any) => {
            onChangeMove(value);
          }}
          options={drop(1, Object.keys(USEFUL_MOVES))}
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
              label={`Move ${index + 1}`}
              variant="outlined"
            />
          )}
          selectOnFocus
          value={moveDisplayName}
        />
      </Grid>
      <Grid item xs={6} style={{ display: 'flex', alignItems: 'center' }}>
        <Typography>{description}</Typography>
      </Grid>
    </>
  );
};

export default MovePicker;
