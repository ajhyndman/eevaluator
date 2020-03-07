import React, { useState } from 'react';

import { Container } from '@material-ui/core';
import { calculate, Move, Pokemon } from '@smogon/calc';

import PokemonPicker from './PokemonPicker';

const GENERATION = 8;

function App() {
  const pikachu = new Pokemon(GENERATION, 'Pikachu');

  const [pokemon1, setPokemon1] = useState(pikachu);
  const [pokemon2, setPokemon2] = useState(pikachu);

  const move = pokemon1.moves[0] && new Move(GENERATION, pokemon1.moves[0]);
  const result = move && calculate(GENERATION, pokemon1, pokemon2, move);
  const desc = result && result.damage.length > 1 && result.fullDesc();

  console.log(pikachu);

  return (
    <Container maxWidth="lg">
      {desc}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <PokemonPicker pokemon={pokemon1} onChange={setPokemon1} />
        <PokemonPicker pokemon={pokemon2} onChange={setPokemon2} />
      </div>
    </Container>
  );
}

export default App;
