import React from 'react';

import { TypeName } from '@smogon/calc/dist/data/interface';

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
  type: TypeName;
};

const TYPE_ICONS = {
  Bug: iconBug.src,
  Dark: iconDark.src,
  Dragon: iconDragon.src,
  Electric: iconElectric.src,
  Fairy: iconFairy.src,
  Fighting: iconFighting.src,
  Fire: iconFire.src,
  Flying: iconFlying.src,
  Ghost: iconGhost.src,
  Grass: iconGrass.src,
  Ground: iconGround.src,
  Ice: iconIce.src,
  Normal: iconNormal.src,
  Poison: iconPoison.src,
  Psychic: iconPsychic.src,
  Rock: iconRock.src,
  Steel: iconSteel.src,
  Water: iconWater.src,
};

const SIZES = {
  small: 24,
  medium: 32,
};

const TypeIcon = ({ size = 'medium', type }: Props) =>
  type !== '???' ? <img style={{ width: SIZES[size] }} alt={type} src={TYPE_ICONS[type]} /> : null;

export default TypeIcon;
