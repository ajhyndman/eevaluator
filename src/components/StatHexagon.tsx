import { path } from 'd3-path';
import { ScaleLinear, scaleLinear } from 'd3-scale';
import { clamp, sum } from 'ramda';
import React, { ChangeEvent } from 'react';

import { TextField } from '@material-ui/core';
import { Stat } from '@smogon/calc';

import { BLUE, RED } from '../styles';
import { polarToCartesian, STAT_LABEL } from '../util';
import TriangleSlider from './TriangleSlider';

type ModernStat = Exclude<Stat, 'spc'>;
export type Stats = { [stat in ModernStat]: number };

type Props = {
  boosts: Stats;
  onBoostsChange: (boosts: Stats) => void;
  natureFavoredStat: Stat;
  natureUnfavoredStat: Stat;
  onStatsChange: (stats: Stats) => void;
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

const StatHexagon = ({
  boosts,
  onBoostsChange,
  natureFavoredStat,
  natureUnfavoredStat,
  onStatsChange,
  realStats,
  statKey,
  stats,
}: Props) => {
  const statMax = statKey === 'ivs' ? MAX_IV : MAX_EV;

  const handleStatChange = (key: Stat) => (event: ChangeEvent<HTMLInputElement>) => {
    const numericValue = parseInt(event.target.value || '0');
    const newValue = clamp(0, statMax, numericValue);

    onStatsChange({ ...stats, [key]: newValue });
  };

  const handleBoostChange = (key: ModernStat) => (value: number) =>
    onBoostsChange({ ...boosts, [key]: value });

  const statScale = scaleLinear()
    .domain([0, statMax])
    .range([10, RADIUS]);

  return (
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
        const [x, y] = polarToCartesian([RADIUS + INPUT_SIZE * (5 / 6), 2 * Math.PI * (i / 6)]);

        return (
          <>
            <div
              key={key}
              style={{
                alignItems: 'center',
                display: 'flex',
                position: 'absolute',
                textAlign: 'center',
                transform: `translate(${x}px, ${y}px)`,
              }}
            >
              <TriangleSlider value={boosts[key]} onChange={handleBoostChange(key)} />
              <div style={{ order: i === 1 || i === 2 ? -1 : 1 }}>
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
            </div>
          </>
        );
      })}
    </div>
  );
};

export default StatHexagon;
