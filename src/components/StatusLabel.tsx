import React from 'react';

import { Typography } from '@material-ui/core';
import { Status } from '@smogon/calc/dist/pokemon';

type Props = {
  status: Status;
};

const STATUS_COLORS: { [key in Status]: string } = {
  Burned: '#F08030',
  Healthy: '',
  Paralyzed: '#F8D030',
  Frozen: '#98D8D8',
  Asleep: '#8C888C',
  Poisoned: '#A040A0',
  'Badly Poisoned': 'black',
};

const StatusLabel = ({ status }: Props) => (
  <Typography
    variant="body2"
    style={{
      backgroundColor: STATUS_COLORS[status],
      color: status !== 'Healthy' ? 'white' : 'inherit',
      display: 'inline-block',
      padding: '0 4px',
      margin: '-1px 0',
      borderRadius: 4,
      textTransform: 'uppercase',
    }}
  >
    {status}
  </Typography>
);

export default StatusLabel;
