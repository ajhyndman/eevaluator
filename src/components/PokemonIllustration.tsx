import React from 'react';

import { Pokemon } from '@smogon/calc';

import { TRANSITION } from '../styles';
import { escapeFilename } from '../util/escapeFilename';

type Props = {
  flip: boolean;
  pokemon: Pokemon;
};

function PokemonIllustration({ flip, pokemon }: Props) {
  const pokemonName = pokemon.name;

  return (
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
        filter: 'opacity(25%)',
        mixBlendMode: 'multiply',
        transform: flip
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
  );
}

export default PokemonIllustration;
