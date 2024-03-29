import React from 'react';

import { Weather } from '@smogon/calc/dist/data/interface';

import sunIcon from '../assets/Harsh_sunlight_icon_SwSh.png';
import rainIcon from '../assets/Rain_icon_SwSh.png';
import sandIcon from '../assets/Sandstorm_icon_SwSh.png';
import hailIcon from '../assets/Snow_icon_SwSh.png';

type Props = {
  weather: Weather;
};

const IMAGES: { [key in Weather]: string } = {
  Sun: sunIcon.src,
  Snow: hailIcon.src,
  Hail: hailIcon.src,
  Rain: rainIcon.src,
  Sand: sandIcon.src,
  'Harsh Sunshine': '',
  'Heavy Rain': '',
  'Strong Winds': '',
};

const WeatherIcon = ({ weather }: Props) => (
  <img style={{ width: 28, margin: -2 }} src={IMAGES[weather]} alt={weather} />
);

export default WeatherIcon;
