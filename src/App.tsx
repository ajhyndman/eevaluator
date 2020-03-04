import React, { useState } from 'react';
import { scaleLinear, ScaleLinear } from 'd3-scale';
import { path } from 'd3-path';
import { clamp } from 'ramda';

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
const INPUT_SIZE = 25;

const INITIAL_STATS: Stats = {
  [Stat.ATT]: 252,
  [Stat.DEF]: 0,
  [Stat.SPA]: 0,
  [Stat.SPD]: 0,
  [Stat.SPE]: 252,
  [Stat.HP]: 4,
};

const ev = scaleLinear()
  .domain([0, 252])
  .range([10, RADIUS]);

const drawHexagon = ([first, ...rest]: number[]) => {
  const hexagonPath = path();
  hexagonPath.moveTo(0, -first);
  rest.forEach((radius, i) => {
    hexagonPath.lineTo(
      Math.sin(2 * Math.PI * ((i + 1) / 6)) * radius,
      -Math.cos(2 * Math.PI * ((i + 1) / 6)) * radius,
    );
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

  const handleStatChange = (key: Stat) => (event: any) => {
    const newValue = clamp(0, 252, event.target.value);
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
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <g transform={`translate(${RADIUS} ${RADIUS})`}>
          <path
            d={drawHexagon([RADIUS, RADIUS, RADIUS, RADIUS, RADIUS, RADIUS])}
            fill="white"
          />
          <path d={drawHexagon(dataFromStats(stats, ev))} fill="violet" />
        </g>
      </svg>

      {[Stat.HP, Stat.ATT, Stat.DEF, Stat.SPE, Stat.SPD, Stat.SPA].map(
        (key, i) => (
          <div
            style={{
              color: 'white',
              position: 'absolute',
              transform: `translate(${Math.sin(2 * Math.PI * (i / 6)) *
                (RADIUS + INPUT_SIZE)}px,
          ${-Math.cos(2 * Math.PI * (i / 6)) * (RADIUS + INPUT_SIZE)}px)`,
            }}
          >
            <input
              onChange={handleStatChange(key)}
              style={{ border: 'none', maxWidth: INPUT_SIZE }}
              value={stats[key]}
            />
          </div>
        ),
      )}
    </div>
  );
}

export default App;
