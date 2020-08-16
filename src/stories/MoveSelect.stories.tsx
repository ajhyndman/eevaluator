import React, { useState } from 'react';

import { Field, Pokemon } from '@smogon/calc';

import MoveSelect from '../components/MoveSelect';

export default {
  title: 'MoveSelect',
  component: MoveSelect,
  decorators: [
    (story: any) => (
      <div
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translate(-50%, 0)',
          width: 400,
        }}
      >
        {story()}
      </div>
    ),
  ],
};

const INITIAL_MOVE = 'Thunderbolt';

export const SingleInput = () => {
  const [move, setMove] = useState<string | undefined>(INITIAL_MOVE);
  return (
    <>
      <MoveSelect value={move} onChange={setMove} />
      <MoveSelect value={move} onChange={setMove} effectiveness="Super effective" />
      <MoveSelect value={move} onChange={setMove} effectiveness="Effective" />
    </>
  );
};
