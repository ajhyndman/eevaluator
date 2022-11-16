import React from 'react';

import itemSpritesheet from '../assets/item-spritesheet.png';
import { SHOWDOWN_ITEMS } from '../util/showdown-item-data';

type Props = {
  item: string;
};

const SIZE = 24;

const computeOffset = (showdownItem: NonNullable<ReturnType<typeof getShowdownItem>>) => {
  const index = showdownItem.spritenum;
  const col = index % 16;
  const row = Math.floor(index / 16);

  return [col * SIZE, row * SIZE];
};

const getShowdownItem = (item: string) => {
  // Strip parentheses after TR numbers.
  const parsedName = item.replace(/\(.+\)$/, '').trim();
  return Object.values(SHOWDOWN_ITEMS).find(({ name }) => name === parsedName);
};

const ItemIcon = ({ item }: Props) => {
  const showdownItem = getShowdownItem(item);
  if (showdownItem == null) {
    return null;
  }

  const [x, y] = computeOffset(showdownItem);
  console.log({ itemSpritesheet });
  const background = `url(${itemSpritesheet.src}) no-repeat scroll -${x}px -${y}px`;

  return <div style={{ background, width: SIZE, height: SIZE }} />;
};

export default ItemIcon;
