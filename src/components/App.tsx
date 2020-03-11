import React, { useState } from 'react';

import { Container, Grid } from '@material-ui/core';
import { Pokemon } from '@smogon/calc';

import MovePicker from './MovePicker';
import PokemonPicker from './PokemonPicker';

const GENERATION = 8;

function App() {
  const pikachu = new Pokemon(GENERATION, 'Pikachu', { level: 50 });

  const [pokemon1, setPokemon1] = useState(pikachu);
  const [pokemon2, setPokemon2] = useState(pikachu);

  return (
    <Container maxWidth="md">
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Grid container spacing={1}>
            <MovePicker attacker={pokemon1} defender={pokemon2} />
            <MovePicker attacker={pokemon1} defender={pokemon2} />
            <MovePicker attacker={pokemon1} defender={pokemon2} />
            <MovePicker attacker={pokemon1} defender={pokemon2} />
            <PokemonPicker pokemon={pokemon1} onChange={setPokemon1} />
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid container spacing={1}>
            <MovePicker attacker={pokemon2} defender={pokemon1} />
            <MovePicker attacker={pokemon2} defender={pokemon1} />
            <MovePicker attacker={pokemon2} defender={pokemon1} />
            <MovePicker attacker={pokemon2} defender={pokemon1} />
            <PokemonPicker pokemon={pokemon2} onChange={setPokemon2} />
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
