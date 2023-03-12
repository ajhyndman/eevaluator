import Head from 'next/head';
import { omit, pick, range } from 'ramda';
import React, { useEffect, useState } from 'react';

import {
  Badge,
  Button,
  Container,
  Dialog,
  Fab,
  Grid,
  Link,
  SwipeableDrawer,
  Toolbar,
  Typography,
} from '@material-ui/core';
import GitHubIcon from '@material-ui/icons/GitHub';
import TerrainIcon from '@material-ui/icons/Terrain';
import { Field, Pokemon } from '@smogon/calc';
import { Terrain, Weather } from '@smogon/calc/dist/data/interface';

import Favorites from '../components/Favorites';
import FieldPicker from '../components/FieldPicker';
import ImportExport from '../components/ImportExport';
import MovePicker from '../components/MovePicker';
import PokemonPicker from '../components/PokemonPicker';
import {
  clonePokemon,
  GENERATION,
  GITHUB_URL,
  readFromLocalStorage,
  writeToLocalStorage,
} from '../util/misc';

type PokemonKey = 'pokemon-left' | 'pokemon-right';

const MOBILE_APP_SHORT_NAME = 'Eevaluator';

const META_DESCRIPTION =
  'Damage calculator for Pokemon Scarlet and Violet VGC 2023. Run damage calculations for competitive pokemon battles with a mobile-friendly interface.';

const WEATHER: Partial<{ [key in Weather]: string }> = {
  Sun: '/images/background/sun.png',
  Rain: '/images/background/rain.png',
  Sand: '/images/background/sand.png',
  Snow: '/images/background/hail.png',
};
const TERRAIN: { [key in Terrain]: string } = {
  Electric: '/images/background/electric-nosky.png',
  Grassy: '/images/background/grass-nosky.png',
  Misty: '/images/background/mist-nosky.png',
  Psychic: '/images/background/psychic-nosky.png',
};

const Background = ({ weather, terrain }: { weather?: Weather; terrain?: Terrain }) => {
  const weatherImg = weather ? WEATHER[weather] : '';
  const terrainImg = terrain ? TERRAIN[terrain] : '';

  const showSky = ['Snow', 'Sun'].includes(weather as Weather);

  return (
    <>
      <Head>
        <style>{`
          .overlay {
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: -1;
          }
          .terrain {
            background-color: ${showSky ? '#99c8da' : 'transparent'};
            background-image: ${`url(${terrainImg})`};
            background-size: 100% auto;
            background-repeat: no-repeat;
            background-position: bottom -200px center;
            opacity: 0.5;
          }
          .weather {
            background-image: url(${weatherImg});
            background-size: cover;
            background-repeat: no-repeat;
            background-position: top center;
            opacity: ${showSky ? 1 : 0.5} ;
          }
        `}</style>
      </Head>
      <div className="overlay terrain" />
      <div className="overlay weather" />
    </>
  );
};

const Eevaluator = () => {
  const eevee = new Pokemon(GENERATION, 'Eevee', { level: 50 });

  const [pokemonLeft, setPokemonLeft] = useState(eevee);
  const [pokemonRight, setPokemonRight] = useState(eevee);

  // Attempt to load state from LocalStorage on mount.
  useEffect(() => {
    // selected pokemon
    const left = readFromLocalStorage('pokemon-left');
    const right = readFromLocalStorage('pokemon-right');
    if (left) setPokemonLeft(new Pokemon(GENERATION, left.name, left));
    if (right) setPokemonRight(new Pokemon(GENERATION, right.name, right));

    // favorites
    const favorites: Pokemon[] = readFromLocalStorage('favorites');
    if (favorites) {
      setFavorites(
        favorites.map(
          (favorite) => new Pokemon(GENERATION, favorite.name, { ...favorite, curHP: undefined }),
        ),
      );
    }
  }, []);

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
  const [showFieldDrawer, setShowFieldDrawer] = useState(false);

  const countFieldEffects = [
    field.gameType === 'Singles',
    ...Object.values(field.attackerSide),
    ...Object.values(
      pick(['isBeadsOfRuin', 'isSwordOfRuin', 'isTabletsOfRuin', 'isVesselOfRuin'], field),
    ),
  ].reduce((acc, value) => acc + (value ? 1 : 0), 0);

  const [favorites, setFavorites] = useState<Pokemon[]>(() => {
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

  const handleMoveChange =
    (prevPokemon: Pokemon, setState: any, key: PokemonKey, index: number) =>
    (move: string | undefined) => {
      const nextMoves: any = prevPokemon.moves.slice();
      nextMoves[index] = move;
      const nextPokemon = clonePokemon(prevPokemon, { moves: nextMoves });

      savePokemon(setState, key)(nextPokemon);
    };

  return (
    <>
      <Head>
        <title>Eevaluator :: Pokemon VGC Damage Calculator</title>
        <meta httpEquiv="content-language" content="en-us" />
        <meta name="description" content={META_DESCRIPTION} />
        <meta property="og:title" content={MOBILE_APP_SHORT_NAME} />
        <meta property="og:description" content={META_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_URL}`} />
        <meta property="og:image" content={`${process.env.NEXT_PUBLIC_URL}/preview.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="1200" />
        <meta
          property="og:image:alt"
          content="Gigantamax Eevee deals 121–144% damage to its opponent for a gauaranteed knockout. Eevee is currently poisoned."
        />

        {/* PWA settings */}
        <meta name="application-name" content={MOBILE_APP_SHORT_NAME} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={MOBILE_APP_SHORT_NAME} />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-tap-highlight" content="no" />
      </Head>

      {/* SEO title */}
      <h1 style={{ position: 'absolute', left: -9999 }}>
        VGC 2023: Scarlet &amp; Violet Damage Calculator
      </h1>

      <Background weather={field.weather} terrain={field.terrain} />

      <Container maxWidth="md" style={{ paddingTop: 16 }}>
        <Grid container spacing={2}>
          {/* POKEMON 1 */}
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
                field={field}
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

          {/* POKEMON 2 */}
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
                field={field}
                onChange={savePokemon(setPokemonRight, 'pokemon-right')}
                onExportClick={handleOpenImportExport('pokemon-right')}
                onOpenFavorites={handleOpenFavorites('pokemon-right')}
                onSaveFavorite={handleSaveFavorite('pokemon-right')}
              />
              <Grid item />
            </Grid>
          </Grid>
        </Grid>
      </Container>

      {/* FOOTER */}
      <Toolbar variant="dense">
        <div style={{ flexGrow: 1 }} />
        <div>
          <Typography color="textSecondary" variant="body2" component="em">
            background illustrations ©{' '}
            <Link target="_blank" href="https://www.behance.net/lucas95garcia">
              Lucas Garcia
            </Link>
          </Typography>
        </div>
        <div style={{ width: '1em' }} />
        <Link href={GITHUB_URL}>
          <Button startIcon={<GitHubIcon />} size="small">
            GitHub
          </Button>
        </Link>
      </Toolbar>

      <div style={{ position: 'fixed', left: 16, bottom: 16 }}>
        <Badge
          badgeContent={countFieldEffects}
          color="primary"
          overlap="circle"
          aria-label="number of active field effects"
        >
          <Fab color="default" title="Field Settings" onClick={() => setShowFieldDrawer(true)}>
            <TerrainIcon />
          </Fab>
        </Badge>
      </div>

      {/* SETTINGS MENU */}
      <SwipeableDrawer
        open={showFieldDrawer}
        anchor="left"
        onClose={() => setShowFieldDrawer(false)}
        onOpen={() => setShowFieldDrawer(true)}
      >
        <div style={{ width: 368 }}>
          <FieldPicker field={field} onChange={setField} />
        </div>
      </SwipeableDrawer>

      {/* MODALS */}
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
    </>
  );
};

export default Eevaluator;
