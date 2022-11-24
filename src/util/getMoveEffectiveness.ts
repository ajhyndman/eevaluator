import { Field, Pokemon } from '@smogon/calc';
import { getMoveEffectiveness as getMoveEffectivenessSmogon } from '@smogon/calc/dist/mechanics/util';
import { Move } from '@smogon/calc/dist/move';

import { GENERATION } from './misc';

type Effectiveness = 0.25 | 0.5 | 1 | 2 | 4;

export const getMoveEffectiveness = (
  moveName: string,
  attacker: Pokemon,
  defender: Pokemon,
  field: Field,
): Effectiveness => {
  const move = new Move(GENERATION, moveName);
  const isGhostRevealed = attacker.hasAbility('Scrappy') || field.defenderSide.isForesight;

  if (move.name === 'Tera Blast' && attacker.teraType != null) {
    move.type = attacker.teraType;
  }
  if (move.name === 'Raging Bull') {
    if (attacker.name === 'Tauros-Paldea') move.type = 'Fighting';
    if (attacker.name === 'Tauros-Paldea-Fire') move.type = 'Fire';
    if (attacker.name === 'Tauros-Paldea-Water') move.type = 'Water';
  }

  const type1Effectiveness = getMoveEffectivenessSmogon(
    GENERATION,
    move,
    defender.types[0],
    isGhostRevealed,
    field.isGravity,
  );
  const type2Effectiveness = defender.types[1]
    ? getMoveEffectivenessSmogon(
        GENERATION,
        move,
        defender.types[1],
        isGhostRevealed,
        field.isGravity,
      )
    : 1;

  const teraTypeEffectiveness =
    defender.teraType &&
    getMoveEffectivenessSmogon(
      GENERATION,
      move,
      defender.teraType,
      isGhostRevealed,
      field.isGravity,
    );
  return (teraTypeEffectiveness ?? type1Effectiveness * type2Effectiveness) as Effectiveness;
};
