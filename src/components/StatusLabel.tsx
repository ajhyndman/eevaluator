import React from 'react';

import { Typography } from '@material-ui/core';
import { StatusName } from '@smogon/calc/dist/data/interface';

type Props = {
  status: StatusName | '';
};

const STATUS_COLORS: { [key in StatusName | '']: string } = {
  brn: '#F08030',
  par: '#F8D030',
  frz: '#98D8D8',
  slp: '#8C888C',
  psn: '#A040A0',
  tox: 'black',
  '': '',
};

const STATUS_NAMES: { [key in StatusName | '']: string } = {
  brn: 'Burned',
  par: 'Paralyzed',
  frz: 'Frozen',
  slp: 'Asleep',
  psn: 'Poisoned',
  tox: 'Badly Poisoned',
  '': 'Healthy',
};

export const STATUS: (StatusName | '')[] = [
  '',
  'par',
  'psn',
  // 'Badly Poisoned',
  'brn',
  'slp',
  'frz',
];

const StatusLabel = ({ status }: Props) => (
  <Typography
    variant="body2"
    style={{
      backgroundColor: STATUS_COLORS[status],
      color: status !== '' ? 'white' : 'inherit',
      display: 'inline-block',
      padding: '0 4px',
      margin: '-1px 0',
      borderRadius: 4,
      textTransform: 'uppercase',
    }}
  >
    {STATUS_NAMES[status]}
  </Typography>
);

export default StatusLabel;
