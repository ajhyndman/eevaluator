import { range } from 'ramda';
import React, { useState } from 'react';

import { Button, Container, Dialog, Grid, Link, ThemeProvider, Toolbar } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import createPalette from '@material-ui/core/styles/createPalette';
import GitHubIcon from '@material-ui/icons/GitHub';
import { Pokemon } from '@smogon/calc';

import { BLUE, RED } from '../styles';
import {
  clonePokemon,
  GENERATION,
  GITHUB_URL,
  readFromLocalStorage,
  writeToLocalStorage,
} from '../util/misc';
import ImportExport from './ImportExport';
import MovePicker from './MovePicker';
import PokemonPicker from './PokemonPicker';

type PokemonKey = 'pokemon-left' | 'pokemon-right';

const THEME = createMuiTheme({
  palette: createPalette({
    primary: { main: RED },
    secondary: { main: BLUE },
    text: {
      primary: '#222233',
      secondary: 'rgba(0, 0, 10, 0.8)',
    },
  }),
});

function App() {
  const eevee = new Pokemon(GENERATION, 'Eevee', { level: 50 });

  const [pokemonLeft, setPokemonLeft] = useState(() => {
    const pokemon = readFromLocalStorage('pokemon-left');
    if (pokemon) {
      return pokemon;
    }
    return eevee;
  });
  const [pokemonRight, setPokemonRight] = useState(() => {
    const pokemon = readFromLocalStorage('pokemon-right');
    if (pokemon) {
      return pokemon;
    }
    return eevee;
  });

  const savePokemon = (setState: any, key: PokemonKey) => (pokemon: Pokemon) => {
    writeToLocalStorage(key, pokemon);
    setState(pokemon);
  };

  const [showImportExport, setShowImportExport] = useState<'pokemon-left' | 'pokemon-right' | null>(
    null,
  );
  const handleOpenImportExport = (key: PokemonKey) => () => setShowImportExport(key);
  const handleCloseImportExport = () => setShowImportExport(null);
  const handleImportPokemon = (pokemon: Pokemon) => {
    const setPokemon = showImportExport === 'pokemon-left' ? setPokemonLeft : setPokemonRight;
    savePokemon(setPokemon, showImportExport!)(pokemon);
    handleCloseImportExport();
  };

  const handleMoveChange = (
    prevPokemon: Pokemon,
    setState: any,
    key: PokemonKey,
    index: number,
  ) => (move: string | undefined) => {
    const nextMoves: any = prevPokemon.moves.slice();
    nextMoves[index] = move;
    const nextPokemon = clonePokemon(prevPokemon, { moves: nextMoves });

    savePokemon(setState, key)(nextPokemon);
  };

  return (
    <ThemeProvider theme={THEME}>
      <Container maxWidth="md" style={{ paddingTop: 16 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Grid container spacing={1}>
              {range(0, 4).map(n => (
                <MovePicker
                  key={n}
                  index={n}
                  move={pokemonLeft.moves[n]}
                  onChangeMove={handleMoveChange(pokemonLeft, setPokemonLeft, 'pokemon-left', n)}
                  attacker={pokemonLeft}
                  defender={pokemonRight}
                />
              ))}
              <PokemonPicker
                pokemon={pokemonLeft}
                onChange={savePokemon(setPokemonLeft, 'pokemon-left')}
                onExportClick={handleOpenImportExport('pokemon-left')}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container spacing={1}>
              {range(0, 4).map(n => (
                <MovePicker
                  key={n}
                  index={n}
                  move={pokemonRight.moves[n]}
                  onChangeMove={handleMoveChange(pokemonRight, setPokemonRight, 'pokemon-right', n)}
                  attacker={pokemonRight}
                  defender={pokemonLeft}
                />
              ))}
              <PokemonPicker
                pokemon={pokemonRight}
                onChange={savePokemon(setPokemonRight, 'pokemon-right')}
                onExportClick={handleOpenImportExport('pokemon-right')}
              />
            </Grid>
          </Grid>
        </Grid>

        <Dialog open={showImportExport != null} onClose={handleCloseImportExport} fullWidth>
          {showImportExport != null && (
            <ImportExport
              pokemon={showImportExport === 'pokemon-left' ? pokemonLeft : pokemonRight}
              onImport={handleImportPokemon}
            />
          )}
        </Dialog>
      </Container>

      <Toolbar variant="dense">
        <div style={{ flexGrow: 1 }} />
        <Link href={GITHUB_URL}>
          <Button startIcon={<GitHubIcon />} size="small">
            GitHub
          </Button>
        </Link>
      </Toolbar>
    </ThemeProvider>
  );
}

export default App;
