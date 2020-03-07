import { path } from 'd3-path';
import { scaleLinear, ScaleLinear } from 'd3-scale';
import { clamp, sum } from 'ramda';
import React, { ChangeEvent } from 'react';

import {
  Container,
  FormControlLabel,
  Input,
  Slider,
  Switch,
  TextField,
  ThemeProvider,
} from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import createPalette from '@material-ui/core/styles/createPalette';
import Typography from '@material-ui/core/Typography';
import { Autocomplete } from '@material-ui/lab';
import { ABILITIES, ITEMS, MOVES, Pokemon, SPECIES, Stat, StatsTable } from '@smogon/calc';

type Stats = StatsTable<number>;
type ModernStat = Exclude<Stat, 'spc'>;

type Props = {
  pokemon: Pokemon;
  onChange: (pokemon: Pokemon) => void;
};

const GENERATION = 8;

const RED = 'rgb(230, 12, 91)';
const BLUE = 'rgb(4, 160, 237)';

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

const SIZE = 150;
const RADIUS = SIZE / 2;
const INPUT_SIZE = 55;

const MAX_EVS = 508;

const STAT_LABEL: { [key in Stat]: string } = {
  atk: 'Attack',
  def: 'Defense',
  hp: 'HP',
  spa: 'Sp. Atk',
  spc: 'Special',
  spd: 'Sp. Def',
  spe: 'Speed',
};

const ev = scaleLinear()
  .domain([0, 252])
  .range([10, RADIUS]);

const polarToCartesian = ([radius, angle]: [number, number]) => [
  Math.sin(angle) * radius,
  -Math.cos(angle) * radius,
];

const drawHexagon = ([first, ...rest]: number[]) => {
  const hexagonPath = path();
  const [x, y] = polarToCartesian([first, 0]);
  hexagonPath.moveTo(x, y);
  rest.forEach((radius, i) => {
    const [x, y] = polarToCartesian([radius, 2 * Math.PI * ((i + 1) / 6)]);
    hexagonPath.lineTo(x, y);
  });
  hexagonPath.closePath();

  return hexagonPath.toString();
};

const dataFromStats = (stats: Stats, scale: ScaleLinear<number, number>) => {
  return [stats.hp, stats.atk, stats.def, stats.spe, stats.spd, stats.spa].map(scale);
};

function PokemonPicker({ pokemon, onChange }: Props) {
  const handleStatChange = (key: Stat) => (event: ChangeEvent<HTMLInputElement>) => {
    const numericValue = parseInt(event.target.value || '0');
    const newValue = clamp(0, 252, numericValue);

    const nextPokemon = pokemon.clone();
    nextPokemon.evs[key] = newValue;
    onChange(nextPokemon);
  };

  const evs = pokemon.evs;
  const pokemonName = pokemon.name;

  const setIsMax = (nextIsMax: boolean) => {
    const nextPokemon = pokemon.clone();
    nextPokemon.isMax = nextIsMax;
    onChange(nextPokemon);
  };
  const isMax = pokemon.isMax || false;

  const setSpecies = (nextSpecies: string) => {
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

        <FormControlLabel
          control={
            <Switch
              checked={isMax}
              onChange={(e: any, value: any) => setIsMax(value)}
              color="primary"
            />
          }
          style={{ margin: 0 }}
          label="Dynamax"
          labelPlacement="start"
        />

        {/* pokemon && (
          <div
            style={{ alignItems: 'center', display: 'flex', height: 150, justifyContent: 'center' }}
          >
            <img
              alt={`Illustration of ${pokemon}`}
              src={`https://img.pokemondb.net/artwork/${pokemonName.toLocaleLowerCase()}.jpg`}
              style={{ alignSelf: 'center', maxWidth: 150, maxHeight: 150 }}
            />
          </div>
        ) */}

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
            margin: `${INPUT_SIZE / 4}px 0`,
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
              padding: `${INPUT_SIZE * (7 / 4)}px 0`,
            }}
          >
            <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
              <g transform={`translate(${RADIUS} ${RADIUS})`}>
                <path
                  d={drawHexagon([RADIUS, RADIUS, RADIUS, RADIUS, RADIUS, RADIUS])}
                  fill="white"
                  stroke={BLUE}
                />
                <path
                  d={drawHexagon(dataFromStats(evs, ev))}
                  fill={
                    sum(Object.values(evs)) === MAX_EVS
                      ? 'powderBlue'
                      : sum(Object.values(evs)) < MAX_EVS
                      ? 'gold'
                      : 'red'
                  }
                />
              </g>
            </svg>

            {(['hp', 'atk', 'def', 'spe', 'spd', 'spa'] as ModernStat[]).map((key, i) => {
              const [x, y] = polarToCartesian([
                RADIUS + INPUT_SIZE * (4 / 5),
                2 * Math.PI * (i / 6),
              ]);

              return (
                <div
                  key={key}
                  style={{
                    position: 'absolute',
                    transform: `translate(${x}px, ${y}px)`,
                    textAlign: 'center',
                  }}
                >
                  {/* <p style={{ margin: 0 }}>{STAT_LABEL[key]}</p>
                  <Input
                    type="number"
                    onChange={handleStatChange(key)}
                    style={{ maxWidth: INPUT_SIZE }}
                    value={evs[key]}
                  /> */}
                  <TextField
                    size="small"
                    label={STAT_LABEL[key]}
                    onChange={handleStatChange(key)}
                    style={{ maxWidth: INPUT_SIZE }}
                    value={evs[key]}
                  />
                  <p style={{ margin: '4px 0 0' }}>
                    {pokemon && key === 'hp' ? maxHp : pokemon.stats[key]}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex' }}>
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
        </div>

        <div style={{ margin: '10px 0' }}>
          <Typography gutterBottom>Current HP</Typography>
          <Slider min={0} max={maxHp} defaultValue={maxHp} valueLabelDisplay="auto" marks={marks} />
        </div>

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
      </Container>
    </ThemeProvider>
  );
}

export default PokemonPicker;
