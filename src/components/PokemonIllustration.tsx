import Color from 'color';
import React from 'react';

import { Pokemon } from '@smogon/calc';
import { TypeName } from '@smogon/calc/dist/data/interface';

import {
  BUG,
  DARK,
  DRAGON,
  ELECTRIC,
  FAIRY,
  FIGHTING,
  FIRE,
  FLYING,
  GHOST,
  GRASS,
  GROUND,
  ICE,
  NORMAL,
  POISON,
  PSYCHIC,
  ROCK,
  STEEL,
  TRANSITION,
  WATER,
} from '../styles';
import { escapeFilename } from '../util/escapeFilename';

type Props = {
  index: number;
  pokemon: Pokemon;
  teraType?: TypeName;
};

export const TYPES = {
  Normal: NORMAL,
  Fire: FIRE,
  Water: WATER,
  Grass: GRASS,
  Electric: ELECTRIC,
  Ice: ICE,
  Fighting: FIGHTING,
  Poison: POISON,
  Ground: GROUND,
  Flying: FLYING,
  Psychic: PSYCHIC,
  Bug: BUG,
  Rock: ROCK,
  Ghost: GHOST,
  Dragon: DRAGON,
  Dark: DARK,
  Steel: STEEL,
  Fairy: FAIRY,
} as const;

function PokemonIllustration({ index, pokemon, teraType }: Props) {
  const pokemonName = pokemon.name;

  let teraFilter = null;

  if (teraType != null && teraType !== '???') {
    const teraColor = Color(TYPES[teraType])
      .darken(0.5)
      .rgb()
      .array()
      .map((v) => v / 255);

    teraFilter = (
      <svg color-interpolation-filters="sRGB" style={{ display: 'none' }}>
        <filter
          id={`teratype-${index}`}
          color-interpolation-filters="sRGB"
          x="0"
          y="0"
          height="100%"
          width="100%"
        >
          <feColorMatrix
            type="matrix"
            values={` ${1 - teraColor[0]} 0 0 0  ${teraColor[0]}
                  ${1 - teraColor[1]} 0 0 0  ${teraColor[1]}
                  ${1 - teraColor[2]} 0 0 0  ${teraColor[2]}
                    0  0 0 1  0`}
          />
        </filter>
      </svg>
    );
  }

  return (
    <>
      {/* Tera type filter */}
      {teraFilter}

      <div
        style={{
          position: 'absolute',
          top: -48,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundImage: `url(/images/pokemon/${
            pokemon.isDynamaxed
              ? escapeFilename(pokemonName)
              : escapeFilename(pokemonName.replace(/-Gmax$/, ''))
          }.jpg)`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          filter: teraType ? `grayscale(1) url(#teratype-${index}) opacity(50%)` : 'opacity(25%)',
          mixBlendMode: 'multiply',
          transform:
            index !== 0
              ? pokemon.isDynamaxed
                ? 'scale(2, 2)'
                : 'scale(1, 1)'
              : pokemon.isDynamaxed
              ? 'scale(-2, 2)'
              : 'scale(-1, 1)',
          transition: `transform ${TRANSITION}`,
          zIndex: -1,
        }}
      />
    </>
  );
}

export default PokemonIllustration;
