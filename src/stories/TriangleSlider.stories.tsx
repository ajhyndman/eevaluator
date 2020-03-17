import React, { useState } from 'react';

import { action } from '@storybook/addon-actions';

import TriangleSlider from '../components/TriangleSlider';

export default {
  title: 'TriangleSlider',
  component: TriangleSlider,
  decorators: [
    (story: any) => (
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        {story()}
      </div>
    ),
  ],
};

export const Stateless = () => <TriangleSlider value={0} onChange={action('VALUE_CHANGE')} />;

export const Stateful = () => {
  const [value, setValue] = useState(0);
  return <TriangleSlider value={value} onChange={setValue} />;
};
