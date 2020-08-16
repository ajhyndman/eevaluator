import { StringifyOptions } from 'querystring';

import { Field, Generations, Pokemon } from '@smogon/calc';
import { getMoveEffectiveness as getMoveEffectivenessSmogon } from '@smogon/calc/dist/mechanics/util';
import { Move } from '@smogon/calc/dist/move';

import { GENERATION } from './misc';

type Effectiveness = 0.25 | 0.5 | 1 | 2 | 4;

const GEN = Generations.get(GENERATION);

export const getMoveEffectiveness = (
  moveName: string,
  attacker: Pokemon,
  defender: Pokemon,
  field: Field,
): Effectiveness => {
  const move = new Move(GEN, moveName);
  const isGhostRevealed = attacker.hasAbility('Scrappy') || field.defenderSide.isForesight;

  const type1Effectiveness = getMoveEffectivenessSmogon(
    GEN,
    move,
    defender.types[0],
    isGhostRevealed,
    field.isGravity,
  );
  const type2Effectiveness = defender.types[1]
    ? getMoveEffectivenessSmogon(GEN, move, defender.types[1], isGhostRevealed, field.isGravity)
    : 1;
  return (type1Effectiveness * type2Effectiveness) as Effectiveness;
};
