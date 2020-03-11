import React, { ChangeEvent, useState } from 'react';

import {
  Container,
  FormControlLabel,
  Grid,
  MenuItem,
  Slider,
  Switch,
  Tab,
  Tabs,
  TextField,
  ThemeProvider,
} from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import createPalette from '@material-ui/core/styles/createPalette';
import Typography from '@material-ui/core/Typography';
import { Autocomplete } from '@material-ui/lab';
import { ABILITIES, ITEMS, MOVES, NATURES, Pokemon, SPECIES, Stat, StatsTable } from '@smogon/calc';

import StatHexagon, { INPUT_SIZE } from './StatHexagon';
import { BLUE, RED } from './styles';
import TypeIcon from './TypeIcon';
import { STAT_LABEL } from './util';

type ModernStat = Exclude<Stat, 'spc'>;

type Props = {
  pokemon: Pokemon;
  onChange: (pokemon: Pokemon) => void;
};

const GENERATION = 8;

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

const getNature = (plusStat?: Stat, minusStat?: Stat) => {
  return Object.keys(NATURES).find((name: string) => {
    const [a, b] = NATURES[name];
    return a === plusStat && b === minusStat;
  })!;
};

function PokemonPicker({ pokemon, onChange }: Props) {
  const [statTab, setStatTab] = useState(1);
  const statKey = statTab === 0 ? 'ivs' : 'evs';

  const nature = pokemon.nature;
  const [plusStat, minusStat] = NATURES[nature];
  const setPlusStat = (value: ModernStat) => {
    const minusStat = NATURES[nature][1];
    const nextNature = getNature(value, minusStat);

    const nextPokemon = new Pokemon(GENERATION, pokemon.name, { ...pokemon, nature: nextNature });
    onChange(nextPokemon);
  };
  const setMinusStat = (value: ModernStat) => {
    const plusStat = NATURES[nature][0];
    const nextNature = getNature(plusStat, value);

    const nextPokemon = new Pokemon(GENERATION, pokemon.name, { ...pokemon, nature: nextNature });
    onChange(nextPokemon);
  };

  const handleStatsChange = (stats: StatsTable<number>) => {
    const nextPokemon = new Pokemon(GENERATION, pokemon.name, {
      ...pokemon,
      [statKey]: stats,
    });

    onChange(nextPokemon);
  };
  const stats = pokemon[statKey];
  const pokemonName = pokemon.name;

  const setIsMax = (nextIsMax: boolean) => {
    const curHpFraction = pokemon.curHP / pokemon.maxHP();

    const nextPokemon = new Pokemon(GENERATION, pokemon.name, {
      ...pokemon,
      isDynamaxed: nextIsMax,
    });
    nextPokemon.curHP = Math.floor(curHpFraction * nextPokemon.maxHP());
    onChange(nextPokemon);
  };
  const isMax = pokemon.isDynamaxed || false;

  const setSpecies = (nextSpecies: string) => {
    if (nextSpecies == null) {
      return;
    }
    onChange(new Pokemon(GENERATION, nextSpecies, { level: 50 }));
  };

  const setMove = (nextMove: string) => {
    const nextPokemon = pokemon.clone();
    nextPokemon.moves[0] = nextMove;
    onChange(nextPokemon);
  };
  const move = pokemon.moves[0];

  const setAbility = (nextAbility: string) => {
    const nextPokemon = pokemon.clone();
    nextPokemon.ability = nextAbility;
    onChange(nextPokemon);
  };
  const ability = pokemon.ability;

  const setItem = (nextItem: string) => {
    const nextPokemon = pokemon.clone();
    nextPokemon.item = nextItem;
    onChange(nextPokemon);
  };
  const item = pokemon.item;

  const setCurrentHp = (nextHp: number) => {
    const nextPokemon = pokemon.clone();
    nextPokemon.curHP = nextHp;
    onChange(nextPokemon);
  };
  const currentHp = pokemon.curHP;

  const maxHp = pokemon.maxHP();
  const marks = [
    {
      value: 0,
      label: 0,
    },
    {
      value: Math.floor(maxHp / 3),
      label: '33%',
    },
    {
      value: Math.floor(maxHp * 0.5),
      label: '50%',
    },
    {
      value: maxHp,
      label: maxHp,
    },
  ];

  return (
    <ThemeProvider theme={THEME}>
      <Container
        maxWidth="xs"
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          padding: 8,
          margin: 0,
        }}
      >
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Autocomplete
              style={{ flexGrow: 1 }}
              onChange={(e: ChangeEvent<any>, value: any) => {
                setMove(value);
              }}
              options={Object.keys(MOVES[GENERATION])}
              renderInput={params => (
                <TextField {...params} size="small" label="Move" variant="outlined" />
              )}
              value={move || ''}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              getOptionLabel={option => option}
              onChange={(e: ChangeEvent<any>, value: any) => {
                setSpecies(value);
              }}
              options={Object.keys(SPECIES[GENERATION])}
              renderInput={params => (
                <TextField {...params} size="small" label="Pokemon" variant="outlined" />
              )}
              value={pokemonName}
            />
          </Grid>
          <Grid item xs={12} style={{ alignItems: 'center', display: 'flex' }}>
            <TypeIcon type={pokemon.type1} />
            <div style={{ width: 8 }} />
            {pokemon.type2 && <TypeIcon type={pokemon.type2} />}
            <FormControlLabel
              control={
                <Switch
                  checked={isMax}
                  onChange={(e: any, value: any) => setIsMax(value)}
                  color="primary"
                />
              }
              style={{ flexGrow: 1 }}
              label="Dynamax"
              labelPlacement="start"
            />
          </Grid>

          <Grid item xs={12}>
            <Tabs centered value={statTab} onChange={(e: any, value) => setStatTab(value)}>
              <Tab label="IV" />
              <Tab label="EV" />
            </Tabs>
          </Grid>

          <Grid item xs={12}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundImage:
                  pokemon &&
                  `url(https://img.pokemondb.net/artwork/${pokemonName.toLocaleLowerCase()}.jpg)`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
                backgroundPosition: 'center',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.75)',
                  flexGrow: 1,
                  justifyContent: 'center',
                  padding: `${INPUT_SIZE * (3 / 2)}px 0`,
                }}
              >
                <StatHexagon
                  natureFavoredStat={plusStat!}
                  natureUnfavoredStat={minusStat!}
                  onChange={handleStatsChange}
                  realStats={{ ...pokemon.stats, hp: pokemon.maxHP() }}
                  statKey={statKey}
                  stats={stats}
                />
              </div>
            </div>
          </Grid>
          <Grid item xs={12}></Grid>
          <Grid item xs={4}>
            <TextField
              size="small"
              variant="outlined"
              select
              label="↑"
              value={plusStat}
              onChange={(event: any) => setPlusStat(event.target.value)}
            >
              {(['atk', 'def', 'spa', 'spd', 'spe'] as ModernStat[]).map(stat => (
                <MenuItem value={stat}>{STAT_LABEL[stat]}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={4}>
            <TextField
              size="small"
              variant="outlined"
              select
              label="↓"
              value={minusStat}
              onChange={(event: any) => setMinusStat(event.target.value)}
            >
              {(['atk', 'def', 'spa', 'spd', 'spe'] as ModernStat[]).map(stat => (
                <MenuItem value={stat}>{STAT_LABEL[stat]}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={4} style={{ display: 'flex', alignItems: 'center' }}>
            <Typography>{nature}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Autocomplete
              style={{ flexGrow: 1 }}
              getOptionLabel={option => option}
              onChange={(e: ChangeEvent<any>, value: any) => {
                setItem(value);
              }}
              options={ITEMS[GENERATION]}
              renderInput={params => (
                <TextField {...params} size="small" label="Item" variant="outlined" />
              )}
              value={item}
            />
          </Grid>
          <Grid item xs={6}>
            <Autocomplete
              style={{ flexGrow: 1 }}
              getOptionLabel={option => option}
              onChange={(e: ChangeEvent<any>, value: any) => {
                setAbility(value);
              }}
              options={ABILITIES[GENERATION]}
              renderInput={params => (
                <TextField {...params} size="small" label="Ability" variant="outlined" />
              )}
              value={ability}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography gutterBottom>Current HP</Typography>
            <Slider
              min={0}
              max={maxHp}
              value={currentHp}
              onChange={(e: any, value: any) => setCurrentHp(value)}
              valueLabelDisplay="auto"
              marks={marks}
            />
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default PokemonPicker;
