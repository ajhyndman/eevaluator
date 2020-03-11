import { path } from 'd3-path';
import { ScaleLinear, scaleLinear } from 'd3-scale';
import { clamp, sum } from 'ramda';
import React, { ChangeEvent } from 'react';

import { TextField } from '@material-ui/core';
import { Stat, StatsTable } from '@smogon/calc';

import { BLUE, RED } from './styles';
import { STAT_LABEL } from './util';

type ModernStat = Exclude<Stat, 'spc'>;
export type Stats = StatsTable<number>;

type Props = {
  natureFavoredStat: Stat;
  natureUnfavoredStat: Stat;
  onChange: (stats: Stats) => void;
  realStats: Stats;
  statKey: 'ivs' | 'evs';
  stats: Stats;
};

const SIZE = 150;
export const INPUT_SIZE = 55;
export const RADIUS = SIZE / 2;

const MAX_IV = 31;
const MAX_EV = 252;
const MAX_TOTAL_EVS = 508;

const dataFromStats = (stats: Stats, scale: ScaleLinear<number, number>) => {
  return [stats.hp, stats.atk, stats.def, stats.spe, stats.spd, stats.spa].map(scale);
};

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

const polarToCartesian = ([radius, angle]: [number, number]) => [
  Math.sin(angle) * radius,
  -Math.cos(angle) * radius,
];

const StatHexagon = ({
  natureFavoredStat,
  natureUnfavoredStat,
  onChange,
  realStats,
  statKey,
  stats,
}: Props) => {
  const statMax = statKey === 'ivs' ? MAX_IV : MAX_EV;

  const handleStatChange = (key: Stat) => (event: ChangeEvent<HTMLInputElement>) => {
    const numericValue = parseInt(event.target.value || '0');
    const newValue = clamp(0, statMax, numericValue);

    onChange({ ...stats, [key]: newValue });
  };

  const statScale = scaleLinear()
    .domain([0, statMax])
    .range([10, RADIUS]);

  return (
    <>
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <g transform={`translate(${RADIUS} ${RADIUS})`}>
          <path
            d={drawHexagon([RADIUS, RADIUS, RADIUS, RADIUS, RADIUS, RADIUS])}
            fill="white"
            stroke={BLUE}
          />
          <path
            d={drawHexagon(dataFromStats(stats, statScale))}
            fill={
              sum(Object.values(stats)) === MAX_TOTAL_EVS
                ? 'powderBlue'
                : sum(Object.values(stats)) < MAX_TOTAL_EVS
                ? 'gold'
                : 'red'
            }
          />
        </g>
      </svg>

      {(['hp', 'atk', 'def', 'spe', 'spd', 'spa'] as ModernStat[]).map((key, i) => {
        const [x, y] = polarToCartesian([RADIUS + INPUT_SIZE * (4 / 5), 2 * Math.PI * (i / 6)]);

        return (
          <div
            key={key}
            style={{
              position: 'absolute',
              transform: `translate(${x}px, ${y}px)`,
              textAlign: 'center',
            }}
          >
            <TextField
              size="small"
              label={STAT_LABEL[key]}
              onChange={handleStatChange(key)}
              style={{ maxWidth: INPUT_SIZE }}
              value={stats[key]}
              type="number"
            />
            <p
              style={{
                color:
                  key === natureFavoredStat && key === natureUnfavoredStat
                    ? 'inherit'
                    : key === natureFavoredStat
                    ? RED
                    : key === natureUnfavoredStat
                    ? BLUE
                    : 'inherit',
                margin: '4px 0 0',
              }}
            >
              {realStats[key]}
            </p>
          </div>
        );
      })}
    </>
  );
};

export default StatHexagon;
