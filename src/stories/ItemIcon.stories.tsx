import React from 'react';

import ItemIcon from '../components/ItemIcon';

export default {
  title: 'ItemIcon',
  component: ItemIcon,
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

export const Assortment = () => (
  <>
    {['Life Orb', 'Aguav Berry', 'Assault Vest', 'Choice Specs'].map(item => (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <ItemIcon item={item} />
        <p>{item}</p>
      </div>
    ))}
  </>
);
