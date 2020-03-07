import { path } from 'd3-path';
import { scaleLinear, ScaleLinear } from 'd3-scale';
import { clamp, sum } from 'ramda';
import React, { ChangeEvent, useState } from 'react';

import {
  Container,
  FormControlLabel,
  Input,
  Switch,
  TextField,
  ThemeProvider,
} from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import createPalette from '@material-ui/core/styles/createPalette';
import { Autocomplete } from '@material-ui/lab';
import { calcStat, SPECIES, Stat, StatsTable } from '@smogon/calc';
import { shortForm } from '@smogon/calc/dist/stats';

type Stats = StatsTable<number>;
type ModernStat = Exclude<Stat, 'spc'>;

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
const INPUT_SIZE = 50;

const MAX_EVS = 508;

const INITIAL_STATS: Stats = {
  atk: 0,
  def: 0,
  spa: 0,
  spd: 0,
  spe: 0,
  hp: 0,
};

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

const computeActualStat = (
  key: ModernStat,
  baseStat: number,
  effortValue: number,
  individualValue: number = 31,
) => {
  return calcStat(8, key, baseStat, individualValue, effortValue, 50);
};

function App() {
  const [stats, setStats] = useState(INITIAL_STATS);
  const [pokemon, setPokemon] = useState('Pikachu');
  const [isDynamaxed, setIsDynamaxed] = useState(false);

  const handleStatChange = (key: Stat) => (event: ChangeEvent<HTMLInputElement>) => {
    const numericValue = parseInt(event.target.value || '0');
    const newValue = clamp(0, 252, numericValue);
    setStats(stats => ({ ...stats, [key]: newValue }));
  };

  const selectedSpecies = SPECIES[8][pokemon];

  return (
    <ThemeProvider theme={THEME}>
      <Container
        maxWidth="xs"
        style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', padding: 8 }}
      >
        <Autocomplete
          getOptionLabel={option => option}
          onChange={(e: ChangeEvent<any>, value: any) => {
            setPokemon(value);
          }}
          options={Object.keys(SPECIES[8])}
          renderInput={params => <TextField {...params} label="Pokemon" variant="outlined" />}
          value={pokemon}
        />

        <FormControlLabel
          control={
            <Switch
              checked={isDynamaxed}
              onChange={(e: any, value: any) => setIsDynamaxed(value)}
              color="primary"
            />
          }
          style={{ margin: 0 }}
          label="Dynamax"
          labelPlacement="start"
        />

        {pokemon && (
          <div
            style={{ alignItems: 'center', display: 'flex', height: 150, justifyContent: 'center' }}
          >
            <img
              alt="Pokemon sprite"
              src={`https://img.pokemondb.net/artwork/${pokemon.toLocaleLowerCase()}.jpg`}
              style={{ alignSelf: 'center', maxWidth: 150, maxHeight: 150 }}
            />
          </div>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: `${INPUT_SIZE * 2}px 0`,
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
                  d={drawHexagon(dataFromStats(stats, ev))}
                  fill={sum(Object.values(stats)) <= MAX_EVS ? 'gold' : 'red'}
                />
                {dataFromStats(stats, ev).map((radius, i) => {
                  const angle = 2 * Math.PI * (i / 6);
                  const [x, y] = polarToCartesian([radius, angle]);
                  // return <circle cx={x} cy={y} r={10} stroke="black" fill="white" />;

                  const triangleSize = 8;
                  const trianglePath = path();
                  trianglePath.moveTo(0, triangleSize);
                  const [x1, y1] = polarToCartesian([triangleSize, -Math.PI / 3]);
                  trianglePath.lineTo(x1, y1);
                  trianglePath.lineTo(-x1, y1);
                  trianglePath.closePath();
                  return (
                    <g transform={`translate(${x} ${y}) rotate(${angle * (180 / Math.PI)})`}>
                      <path d={trianglePath.toString()} stroke="black" fill="white" />
                    </g>
                  );
                })}
              </g>
            </svg>

            {(['hp', 'atk', 'def', 'spe', 'spd', 'spa'] as ModernStat[]).map((key, i) => {
              const [x, y] = polarToCartesian([RADIUS + INPUT_SIZE, 2 * Math.PI * (i / 6)]);

              return (
                <div
                  style={{
                    position: 'absolute',
                    transform: `translate(${x}px, ${y}px)`,
                    textAlign: 'center',
                  }}
                >
                  <p style={{ margin: 0 }}>{STAT_LABEL[key]}</p>
                  <Input
                    type="number"
                    onChange={handleStatChange(key)}
                    style={{ maxWidth: INPUT_SIZE }}
                    value={stats[key]}
                  />
                  <p style={{ margin: '4px 0 0' }}>
                    {pokemon &&
                      computeActualStat(key, selectedSpecies.bs[shortForm(key)]!, stats[key]) *
                        (isDynamaxed && key === 'hp' ? 2 : 1)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </ThemeProvider>
  );
}

export default App;
