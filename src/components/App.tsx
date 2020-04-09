import { range } from 'ramda';
import React, { useState } from 'react';

import {
  Button,
  Container,
  Dialog,
  Grid,
  Link,
  MenuItem,
  Select,
  ThemeProvider,
  Toolbar,
} from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import createPalette from '@material-ui/core/styles/createPalette';
import GitHubIcon from '@material-ui/icons/GitHub';
import { Field, Pokemon } from '@smogon/calc';
import { Terrain, Weather } from '@smogon/calc/dist/field';

import { BLUE, RED } from '../styles';
import {
  clonePokemon,
  GENERATION,
  GITHUB_URL,
  readFromLocalStorage,
  writeToLocalStorage,
} from '../util/misc';
import Favorites from './Favorites';
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

const WEATHER: Partial<{ [key in Weather]: string }> = {
  Sun: '/images/Robin/weather/sunnocast.png',
  Rain: '/images/Robin/weather/rainnocast.png',
  Sand: '/images/Robin/weather/Sandstorm-nocast.png',
  Hail: '/images/Robin/weather/snownocast.png',
};
const TERRAIN: { [key in Terrain]: string } = {
  Electric: '/images/Robin/Terrain/electerrainnochu.png',
  Grassy: '/images/Robin/Terrain/grassyterrainnobulb.png',
  Misty: '/images/Robin/Terrain/misty1.png',
  Psychic: '/images/Robin/Terrain/psychicterrain.png',
};

const Background = ({ weather, terrain }: { weather?: Weather; terrain?: Terrain }) => {
  const weatherImg = weather ? WEATHER[weather] : '';
  const terrainImg = terrain ? TERRAIN[terrain] : '';
  return (
    <div
      style={{
        backgroundImage: `url(${terrainImg}), url(${weatherImg})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'noRepeat',
        // mixBlendMode: 'multiply',
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: -1,
        opacity: 0.25,
      }}
    />
  );
};

function App() {
  const eevee = new Pokemon(GENERATION, 'Eevee', { level: 50 });

  const [pokemonLeft, setPokemonLeft] = useState(() => {
    const json = readFromLocalStorage('pokemon-left');
    if (json) {
      return new Pokemon(GENERATION, json.name, json);
    }
    return eevee;
  });
  const [pokemonRight, setPokemonRight] = useState(() => {
    const json = readFromLocalStorage('pokemon-right');
    if (json) {
      return new Pokemon(GENERATION, json.name, json);
    }
    return eevee;
  });

  const savePokemon = (setState: any, key: PokemonKey) => (pokemon: Pokemon) => {
    writeToLocalStorage(key, pokemon);
    setState(pokemon);
  };

  const [showImportExport, setShowImportExport] = useState<PokemonKey | null>(null);
  const handleOpenImportExport = (key: PokemonKey) => () => setShowImportExport(key);
  const handleCloseImportExport = () => setShowImportExport(null);
  const handleImportPokemon = (pokemon: Pokemon) => {
    const setPokemon = showImportExport === 'pokemon-left' ? setPokemonLeft : setPokemonRight;
    savePokemon(setPokemon, showImportExport!)(pokemon);
    handleCloseImportExport();
  };

  const [field, setField] = useState(new Field({ gameType: 'Doubles' }));
  const setWeather = (event: any) => {
    setField((field) => new Field({ ...field, weather: event.target.value }));
  };
  const setTerrain = (event: any) => {
    setField((field) => new Field({ ...field, terrain: event.target.value }));
  };

  const [favorites, setFavorites] = useState<Pokemon[]>(() => {
    const favorites: Pokemon[] = readFromLocalStorage('favorites');
    if (favorites) {
      return favorites.map((favorite) => new Pokemon(GENERATION, favorite.name, favorite));
    }
    return [];
  });
  const [showFavorites, setShowFavorites] = useState<PokemonKey | null>(null);
  const handleSaveFavorite = (key: PokemonKey) => (pokemon: Pokemon) => {
    const nextFavorites = [...favorites, pokemon];
    writeToLocalStorage('favorites', nextFavorites);
    setFavorites(nextFavorites);
  };
  const handleRemoveFavorite = (pokemon: Pokemon) => {
    const nextFavorites = favorites.filter((favorite: Pokemon) => favorite !== pokemon);
    writeToLocalStorage('favorites', nextFavorites);
    setFavorites(nextFavorites);
  };
  const handleOpenFavorites = (key: PokemonKey) => () => setShowFavorites(key);
  const handleCloseFavorites = () => setShowFavorites(null);
  const handleLoadFavorite = (pokemon: Pokemon) => {
    const setPokemon = showFavorites === 'pokemon-left' ? setPokemonLeft : setPokemonRight;
    savePokemon(setPokemon, showFavorites!)(pokemon);
    handleCloseFavorites();
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
      <Background weather={field.weather} terrain={field.terrain} />
      <Container maxWidth="md" style={{ paddingTop: 16 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Select value={field.weather} onChange={setWeather}>
              {[undefined, ...Object.keys(WEATHER)].map((option) => (
                <MenuItem key={option} value={option}>
                  {option || 'None'}
                </MenuItem>
              ))}
            </Select>
            <Select value={field.terrain} onChange={setTerrain}>
              {[undefined, ...Object.keys(TERRAIN)].map((option) => (
                <MenuItem key={option} value={option}>
                  {option || 'None'}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container spacing={1}>
              {range(0, 4).map((n) => (
                <MovePicker
                  key={n}
                  index={n}
                  move={pokemonLeft.moves[n]}
                  onChangeMove={handleMoveChange(pokemonLeft, setPokemonLeft, 'pokemon-left', n)}
                  attacker={pokemonLeft}
                  defender={pokemonRight}
                  field={field}
                />
              ))}
              <PokemonPicker
                index={0}
                pokemon={pokemonLeft}
                onChange={savePokemon(setPokemonLeft, 'pokemon-left')}
                onExportClick={handleOpenImportExport('pokemon-left')}
                onOpenFavorites={handleOpenFavorites('pokemon-left')}
                onSaveFavorite={handleSaveFavorite('pokemon-left')}
              />
              {/* Create some spacing for the stacked mobile case.
                  TODO: This shouldn't affect desktop. */}
              <Grid item xs={12}>
                <div style={{ height: 48 }} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container spacing={1}>
              {range(0, 4).map((n) => (
                <MovePicker
                  key={n}
                  index={n}
                  move={pokemonRight.moves[n]}
                  onChangeMove={handleMoveChange(pokemonRight, setPokemonRight, 'pokemon-right', n)}
                  attacker={pokemonRight}
                  defender={pokemonLeft}
                  field={field}
                />
              ))}
              <PokemonPicker
                index={1}
                pokemon={pokemonRight}
                onChange={savePokemon(setPokemonRight, 'pokemon-right')}
                onExportClick={handleOpenImportExport('pokemon-right')}
                onOpenFavorites={handleOpenFavorites('pokemon-right')}
                onSaveFavorite={handleSaveFavorite('pokemon-right')}
              />
              <Grid item />
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

        <Dialog open={showFavorites != null} onClose={handleCloseFavorites} fullWidth maxWidth="xs">
          <Favorites
            favorites={favorites}
            onClose={handleCloseFavorites}
            onSelect={handleLoadFavorite}
            onDelete={handleRemoveFavorite}
          />
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
