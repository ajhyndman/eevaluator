import { calcStat, Stat, StatsTable } from '@smogon/calc';
import React, { ChangeEvent, useState } from 'react';
import { scaleLinear, ScaleLinear } from 'd3-scale';
import { path } from 'd3-path';
import { clamp, sum } from 'ramda';

type Stats = StatsTable<number>;
type ModernStat = Exclude<Stat, 'spc'>

const SIZE = 150;
const RADIUS = SIZE / 2;
const INPUT_SIZE = 40;

const MAX_EVS = 508;

const PIKACHU_BASE_STATS: Stats = {
  atk: 55,
  def: 40,
  spa: 50,
  spd: 50,
  spe: 90,
  hp: 35,
};

const INITIAL_STATS: Stats = {
  atk: 252,
  def: 0,
  spa: 0,
  spd: 0,
  spe: 252,
  hp: 4,
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
  return [stats.hp, stats.atk, stats.def, stats.spe, stats.spd, stats.spa].map(
    scale,
  );
};

const computeActualStat = (
  key: ModernStat,
  effortValue: number,
  individualValue: number = 31,
) => {
  return calcStat(
    8,
    key,
    PIKACHU_BASE_STATS[key],
    individualValue,
    effortValue,
    50,
  );
};

function App() {
  const [stats, setStats] = useState(INITIAL_STATS);

  const handleStatChange = (key: Stat) => (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const newValue = clamp(0, 252, parseInt(event.target.value));
    setStats(stats => ({ ...stats, [key]: newValue }));
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          <g transform={`translate(${RADIUS} ${RADIUS})`}>
            <path
              d={drawHexagon([RADIUS, RADIUS, RADIUS, RADIUS, RADIUS, RADIUS])}
              fill="white"
            />
            <path
              d={drawHexagon(dataFromStats(stats, ev))}
              fill={sum(Object.values(stats)) <= MAX_EVS ? 'gold' : 'red'}
            />
          </g>
        </svg>

        {(['hp', 'atk', 'def', 'spe', 'spd', 'spa'] as ModernStat[]).map(
          (key, i) => {
            const [x, y] = polarToCartesian([
              RADIUS + INPUT_SIZE,
              2 * Math.PI * (i / 6),
            ]);

            return (
              <div
                style={{
                  color: 'white',
                  position: 'absolute',
                  transform: `translate(${x}px, ${y}px)`,
                  textAlign: 'center',
                }}
              >
                <p style={{ margin: '0 0 8px' }}>{STAT_LABEL[key]}</p>
                <input
                  type="number"
                  onChange={handleStatChange(key)}
                  style={{
                    border: 'none',
                    padding: '2px 4px',
                    fontSize: 16,
                    maxWidth: INPUT_SIZE,
                  }}
                  value={stats[key]}
                />
                <p style={{ margin: '8px 0 0' }}>
                  {computeActualStat(key, stats[key])}
                </p>
              </div>
            );
          },
        )}
      </div>
    </div>
  );
}

export default App;
