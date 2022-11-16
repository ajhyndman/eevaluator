import React from 'react';

import pokemonSpritesheet from '../assets/pokemon-spritesheet.png';
import SHOWDOWN_DEX_ICONS from '../util/showdown-dex-data.json';

type Props = {
  species: string;
};

const HEIGHT = 30;
const WIDTH = 40;

const getPokemonIconIndex = (species: string): number => {
  const showdownDexId = species.toLocaleLowerCase().replace(/[^a-z0-9]/g, '');
  return (SHOWDOWN_DEX_ICONS as any)[showdownDexId] || 0;
};

const computeOffset = (species: string) => {
  const index = getPokemonIconIndex(species);
  const col = index % 12;
  const row = Math.floor(index / 12);

  return [col * WIDTH, row * HEIGHT];
};

const PokemonIcon = ({ species }: Props) => {
  const [x, y] = computeOffset(species);

  return (
    <div
      style={{
        backgroundImage: `url(${pokemonSpritesheet.src})`,
        backgroundPosition: `${-x}px ${-y}px`,
        backgroundRepeat: 'no-repeat',
        height: HEIGHT,
        width: WIDTH,
      }}
    />
  );
};

export default PokemonIcon;
