import React, { useState } from 'react';

import { Container, Grid } from '@material-ui/core';
import { Pokemon } from '@smogon/calc';

import { readFromLocalStorage, writeToLocalStorage } from '../util';
import MovePicker from './MovePicker';
import PokemonPicker from './PokemonPicker';

const GENERATION = 8;

function App() {
  const pikachu = new Pokemon(GENERATION, 'Pikachu', { level: 50 });

  const [pokemonLeft, setPokemonLeft] = useState(() => {
    const pokemon = readFromLocalStorage('pokemon-left');
    if (pokemon) {
      return pokemon;
    }
    return pikachu;
  });
  const [pokemonRight, setPokemonRight] = useState(() => {
    const pokemon = readFromLocalStorage('pokemon-right');
    if (pokemon) {
      return pokemon;
    }
    return pikachu;
  });

  const savePokemon = (setState: any, key: string) => (pokemon: Pokemon) => {
    writeToLocalStorage(key, pokemon);
    setState(pokemon);
  };

  return (
    <Container maxWidth="md">
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Grid container spacing={1}>
            <MovePicker attacker={pokemonLeft} defender={pokemonRight} />
            <MovePicker attacker={pokemonLeft} defender={pokemonRight} />
            <MovePicker attacker={pokemonLeft} defender={pokemonRight} />
            <MovePicker attacker={pokemonLeft} defender={pokemonRight} />
            <PokemonPicker
              pokemon={pokemonLeft}
              onChange={savePokemon(setPokemonLeft, 'pokemon-left')}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid container spacing={1}>
            <MovePicker attacker={pokemonRight} defender={pokemonLeft} />
            <MovePicker attacker={pokemonRight} defender={pokemonLeft} />
            <MovePicker attacker={pokemonRight} defender={pokemonLeft} />
            <MovePicker attacker={pokemonRight} defender={pokemonLeft} />
            <PokemonPicker
              pokemon={pokemonRight}
              onChange={savePokemon(setPokemonRight, 'pokemon-right')}
            />
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
