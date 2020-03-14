import { path } from 'd3-path';
import React from 'react';

import { polarToCartesian } from '../util/misc';

const SIZE = 10;

const Triangle = ({ color, flip = false }: { color: string; flip?: boolean }) => {
  const [x, y] = polarToCartesian([SIZE, Math.PI * (5 / 6)]);

  const trianglePath = path();
  trianglePath.moveTo(0, y);
  trianglePath.lineTo(x, 0);
  trianglePath.lineTo(SIZE, y);
  trianglePath.closePath();

  return (
    <svg viewBox={`0 0 ${SIZE} ${y}`} width={SIZE} height={y}>
      <path
        d={trianglePath.toString()}
        fill={color}
        transform={flip ? `translate(0, ${y}) scale(1, -1)` : ''}
      />
    </svg>
  );
};

export default Triangle;
