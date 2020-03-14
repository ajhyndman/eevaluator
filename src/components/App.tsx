import React, { useEffect, useState } from 'react';

import { Container, Grid, ThemeProvider } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import createPalette from '@material-ui/core/styles/createPalette';
import { Pokemon } from '@smogon/calc';

import { BLUE, RED } from '../styles';
import {
  clonePokemon,
  GENERATION,
  pageview,
  readFromLocalStorage,
  writeToLocalStorage,
} from '../util/misc';
import MovePicker from './MovePicker';
import PokemonPicker from './PokemonPicker';

const THEME = createMuiTheme({
  palette: createPalette({
    primary: { main: RED },
    secondary: { main: BLUE },
    background: { default: BLUE },
    text: {
      primary: '#222233',
      secondary: 'rgba(0, 0, 10, 0.8)',
    },
  }),
});

function App() {
  const pikachu = new Pokemon(GENERATION, 'Pikachu', { level: 50 });

  // Log pageview to Google Analytics
  useEffect(pageview, []);

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

  const handleMoveChange = (prevPokemon: Pokemon, setState: any, key: string, index: number) => (
    move: string | undefined,
  ) => {
    const nextMoves: any = prevPokemon.moves.slice();
    nextMoves[index] = move;
    const nextPokemon = clonePokemon(prevPokemon, { moves: nextMoves });

    savePokemon(setState, key)(nextPokemon);
  };

  return (
    <ThemeProvider theme={THEME}>
      <Container maxWidth="md">
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Grid container spacing={1}>
              <MovePicker
                move={pokemonLeft.moves[0]}
                onChangeMove={handleMoveChange(pokemonLeft, setPokemonLeft, 'pokemon-left', 0)}
                attacker={pokemonLeft}
                defender={pokemonRight}
              />
              <MovePicker
                move={pokemonLeft.moves[1]}
                onChangeMove={handleMoveChange(pokemonLeft, setPokemonLeft, 'pokemon-left', 1)}
                attacker={pokemonLeft}
                defender={pokemonRight}
              />
              <MovePicker
                move={pokemonLeft.moves[2]}
                onChangeMove={handleMoveChange(pokemonLeft, setPokemonLeft, 'pokemon-left', 2)}
                attacker={pokemonLeft}
                defender={pokemonRight}
              />
              <MovePicker
                move={pokemonLeft.moves[3]}
                onChangeMove={handleMoveChange(pokemonLeft, setPokemonLeft, 'pokemon-left', 3)}
                attacker={pokemonLeft}
                defender={pokemonRight}
              />
              <PokemonPicker
                pokemon={pokemonLeft}
                onChange={savePokemon(setPokemonLeft, 'pokemon-left')}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container spacing={1}>
              <MovePicker
                move={pokemonRight.moves[0]}
                onChangeMove={handleMoveChange(pokemonRight, setPokemonRight, 'pokemon-right', 0)}
                attacker={pokemonRight}
                defender={pokemonLeft}
              />
              <MovePicker
                move={pokemonRight.moves[1]}
                onChangeMove={handleMoveChange(pokemonRight, setPokemonRight, 'pokemon-right', 1)}
                attacker={pokemonRight}
                defender={pokemonLeft}
              />
              <MovePicker
                move={pokemonRight.moves[2]}
                onChangeMove={handleMoveChange(pokemonRight, setPokemonRight, 'pokemon-right', 2)}
                attacker={pokemonRight}
                defender={pokemonLeft}
              />
              <MovePicker
                move={pokemonRight.moves[3]}
                onChangeMove={handleMoveChange(pokemonRight, setPokemonRight, 'pokemon-right', 3)}
                attacker={pokemonRight}
                defender={pokemonLeft}
              />
              <PokemonPicker
                pokemon={pokemonRight}
                onChange={savePokemon(setPokemonRight, 'pokemon-right')}
              />
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default App;
