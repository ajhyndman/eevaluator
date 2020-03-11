import React from 'react';

import { Type } from '@smogon/calc/dist/data/types';

import iconBug from '../assets/Bug_icon_SwSh.png';
import iconDark from '../assets/Dark_icon_SwSh.png';
import iconDragon from '../assets/Dragon_icon_SwSh.png';
import iconElectric from '../assets/Electric_icon_SwSh.png';
import iconFairy from '../assets/Fairy_icon_SwSh.png';
import iconFighting from '../assets/Fighting_icon_SwSh.png';
import iconFire from '../assets/Fire_icon_SwSh.png';
import iconFlying from '../assets/Flying_icon_SwSh.png';
import iconGhost from '../assets/Ghost_icon_SwSh.png';
import iconGrass from '../assets/Grass_icon_SwSh.png';
import iconGround from '../assets/Ground_icon_SwSh.png';
import iconIce from '../assets/Ice_icon_SwSh.png';
import iconNormal from '../assets/Normal_icon_SwSh.png';
import iconPoison from '../assets/Poison_icon_SwSh.png';
import iconPsychic from '../assets/Psychic_icon_SwSh.png';
import iconRock from '../assets/Rock_icon_SwSh.png';
import iconSteel from '../assets/Steel_icon_SwSh.png';
import iconWater from '../assets/Water_icon_SwSh.png';

type Props = {
  size?: 'small' | 'medium';
  type: Type;
};

const TYPE_ICONS = {
  Bug: iconBug,
  Dark: iconDark,
  Dragon: iconDragon,
  Electric: iconElectric,
  Fairy: iconFairy,
  Fighting: iconFighting,
  Fire: iconFire,
  Flying: iconFlying,
  Ghost: iconGhost,
  Grass: iconGrass,
  Ground: iconGround,
  Ice: iconIce,
  Normal: iconNormal,
  Poison: iconPoison,
  Psychic: iconPsychic,
  Rock: iconRock,
  Steel: iconSteel,
  Water: iconWater,
};

const SIZES = {
  small: 24,
  medium: 32,
};

const TypeIcon = ({ size = 'small', type }: Props) =>
  type !== 'None' ? <img style={{ width: SIZES[size] }} alt={type} src={TYPE_ICONS[type]} /> : null;

export default TypeIcon;
