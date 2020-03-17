import React from 'react';

import StatusLabel, { STATUS } from '../components/StatusLabel';

export default {
  title: 'StatusLabel',
  component: StatusLabel,
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

export const FullSet = () => STATUS.map(status => <StatusLabel status={status} />);
