import React, { ChangeEvent, useState } from 'react';
import { scaleLinear, ScaleLinear } from 'd3-scale';
import { path } from 'd3-path';
import { clamp, sum } from 'ramda';

enum Stat {
  ATT,
  DEF,
  SPA,
  SPD,
  SPE,
  HP,
}

type Stats = { [key in Stat]: number };

const SIZE = 150;
const RADIUS = SIZE / 2;
const INPUT_SIZE = 40;

const MAX_EVS = 508;

const INITIAL_STATS: Stats = {
  [Stat.ATT]: 252,
  [Stat.DEF]: 0,
  [Stat.SPA]: 0,
  [Stat.SPD]: 0,
  [Stat.SPE]: 252,
  [Stat.HP]: 4,
};

const STAT_LABEL = {
  [Stat.ATT]: 'Attack',
  [Stat.DEF]: 'Defense',
  [Stat.SPA]: 'Sp. Atk',
  [Stat.SPD]: 'Sp. Def',
  [Stat.SPE]: 'Speed',
  [Stat.HP]: 'HP',
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
  return [
    stats[Stat.HP],
    stats[Stat.ATT],
    stats[Stat.DEF],
    stats[Stat.SPE],
    stats[Stat.SPD],
    stats[Stat.SPA],
  ].map(scale);
};

function App() {
  const [stats, setStats] = useState(INITIAL_STATS);

  const handleStatChange = (key: Stat) => (event: ChangeEvent<HTMLInputElement>) => {
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

        {[Stat.HP, Stat.ATT, Stat.DEF, Stat.SPE, Stat.SPD, Stat.SPA].map(
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
                    fontSize: 16,
                    maxWidth: INPUT_SIZE,
                  }}
                  value={stats[key]}
                />
              </div>
            );
          },
        )}
      </div>
    </div>
  );
}

export default App;
