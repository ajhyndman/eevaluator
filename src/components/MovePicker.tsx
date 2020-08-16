import React from 'react';

import { Grid, Typography } from '@material-ui/core';
import { calculate, Field, Move, Pokemon } from '@smogon/calc';
import { getMaxMoveName } from '@smogon/calc/dist/move';

import { getMoveEffectiveness } from '../util/getMoveEffectiveness';
import { GENERATION } from '../util/misc';
import MoveSelect from './MoveSelect';

type Props = {
  index: number;
  move?: string;
  onChangeMove: (move: string | undefined) => void;
  attacker: Pokemon;
  defender: Pokemon;
  field: Field;
};

const printPercent = (numerator: number, denominator: number) =>
  Math.round((numerator / denominator) * 100);

const printRange = (minDamage: number, maxDamage: number, maxHp: number) => {
  if (minDamage === maxDamage) {
    return `${printPercent(maxDamage, maxHp)}%`;
  }
  return `${printPercent(minDamage, maxHp)}—${printPercent(maxDamage, maxHp)}%`;
};

const printHko = (n: number) => `${n === 1 ? 'O' : n}HKO`;

const MovePicker = ({ index, attacker, defender, field, move: moveName, onChangeMove }: Props) => {
  const defenderMaxHp = defender.maxHP();

  let description;
  let fullDescription: string;
  let move: Move | undefined;
  if (moveName) {
    move = new Move(GENERATION, moveName, { useMax: attacker.isDynamaxed });
    const result = calculate(GENERATION, attacker, defender, move, field);
    const damage = [result.damage].flat();

    if (damage.some((value) => value !== 0)) {
      const minDamage = (damage[0] as number) * move.hits;
      const maxDamage = (damage[damage.length - 1] as number) * move.hits;
      const { chance, n } = result.kochance();

      description =
        printRange(minDamage, maxDamage, defenderMaxHp) +
        (n > 0 ? ` ${printHko(n)}` : '') +
        (chance != null && chance !== 1 && chance !== 0 ? ` (${Math.round(chance * 100)}%)` : '');

      fullDescription = result.fullDesc();
    }
  }

  const moveDisplayName =
    move == null
      ? ''
      : attacker.isDynamaxed
      ? getMaxMoveName(move.type, attacker.name, move.category === 'Status')
      : moveName;

  const copyDescription = () => {
    window.navigator.clipboard.writeText(fullDescription);
  };

  const effectivenessMultiplier =
    move == null || move.category === 'Status'
      ? NaN
      : getMoveEffectiveness(move.name, attacker, defender, field);
  const effectivenessDescription = Number.isNaN(effectivenessMultiplier)
    ? ''
    : effectivenessMultiplier === 0
    ? 'No effect'
    : effectivenessMultiplier < 1
    ? 'Not very effective'
    : effectivenessMultiplier > 1
    ? 'Super effective'
    : 'Effective';

  return (
    <>
      <Grid item xs={6}>
        <MoveSelect
          value={moveDisplayName}
          onChange={onChangeMove}
          placeholder={`Move ${index + 1}`}
          effectiveness={effectivenessDescription}
        />
      </Grid>
      <Grid item xs={6} style={{ display: 'flex', alignItems: 'center' }}>
        <button
          onClick={copyDescription}
          style={{ border: 'none', boxShadow: 'none', background: 'none', cursor: 'pointer' }}
        >
          <Typography>{description}</Typography>
        </button>
      </Grid>
    </>
  );
};

export default MovePicker;
