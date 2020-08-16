import { compose, drop, pickBy, prop, sortBy, toLower } from 'ramda';
import Select, { components, SingleValueProps, ValueContainerProps, ValueType } from 'react-select';

import { MOVES } from '@smogon/calc';
import { MoveData } from '@smogon/calc/dist/data/moves';

import physicalIcon from '../assets/Physical.svg';
import specialIcon from '../assets/Special.svg';
import statusIcon from '../assets/Status.svg';
import {
  BUG,
  DARK,
  DRAGON,
  ELECTRIC,
  FAIRY,
  FIGHTING,
  FIRE,
  FLYING,
  GHOST,
  GRASS,
  GROUND,
  ICE,
  NORMAL,
  POISON,
  PSYCHIC,
  ROCK,
  STEEL,
  WATER,
} from '../styles';
import { GENERATION } from '../util/misc';

type Props = {
  value?: string;
  onChange: (value?: string) => void;
  placeholder?: string;
  effectiveness?: string;
};

type MoveOption = {
  value: string;
  label: string;
  move: MoveData;
};

const HEIGHT = 40;

export const USEFUL_MOVES: { [name: string]: MoveData } = pickBy(
  (move) => !(move.isMax || move.category == null),
  MOVES[GENERATION],
);

const MOVE_OPTIONS = sortBy(compose(toLower, prop('value')))(
  drop(
    1,
    Object.entries(USEFUL_MOVES).map(([name, move]) => ({
      value: name,
      label: name,
      move,
    })),
  ),
);

const CATEGORY_ICONS = {
  Physical: physicalIcon,
  Special: specialIcon,
  Status: statusIcon,
};

const TYPE_COLORS = {
  Normal: NORMAL,
  Fighting: FIGHTING,
  Flying: FLYING,
  Poison: POISON,
  Ground: GROUND,
  Rock: ROCK,
  Bug: BUG,
  Ghost: GHOST,
  Steel: STEEL,
  Fire: FIRE,
  Water: WATER,
  Grass: GRASS,
  Electric: ELECTRIC,
  Psychic: PSYCHIC,
  Ice: ICE,
  Dragon: DRAGON,
  Dark: DARK,
  Fairy: FAIRY,
  '???': '#EEE',
};

const SingleValue = (props: SingleValueProps<MoveOption>) => {
  const {
    children,
    innerProps,
    selectProps: { effectiveness },
  } = props;
  return (
    <div
      style={{
        whiteSpace: 'nowrap',
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        left: 0,
        right: 0,
      }}
    >
      <span
        style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}
        {...innerProps}
      >
        {children}
      </span>
      {effectiveness && <span style={{ display: 'block', fontSize: 10 }}>{effectiveness}</span>}
    </div>
  );
};

const ValueContainer = ({
  getValue,
  children,
  selectProps: { effectiveness },
}: ValueContainerProps<MoveOption>) => {
  const value = getValue();

  const option: MoveOption | undefined = Array.isArray(value) ? value[0] : value;
  const moveCategory = option?.move.category;
  const moveType = option?.move.type ?? '???';
  const basePower = (option?.move.bp || '—').toString();
  // const background = TYPE_COLORS[moveType];
  const color = ['Dark', 'Dragon', 'Fighting', 'Ghost', 'Poison'].includes(moveType) ? 'white' : '';

  return (
    <div
      style={{
        color,
        // background,
        boxSizing: 'border-box',
        height: HEIGHT,
        padding: '2px 8px 2px 16px',
        position: 'relative',
        display: 'flex',
      }}
    >
      <div style={{ flexGrow: 1, position: 'relative' }}>{children}</div>
      <div
        style={{
          alignItems: 'center',
          color: 'white',
          display: 'flex',
          position: 'relative',
          paddingLeft: 5,
        }}
      >
        <div
          style={{
            background: 'black',
            position: 'absolute',
            right: -HEIGHT,
            left: 0,
            top: -HEIGHT,
            bottom: -HEIGHT,
            transform: 'rotate(25deg)',
          }}
        />
        <div style={{ position: 'relative' }}>{basePower}</div>
        {moveCategory && (
          <img
            style={{ paddingLeft: 4, position: 'relative' }}
            src={CATEGORY_ICONS[moveCategory]}
          />
        )}
      </div>
    </div>
  );
};

const MoveSelect = ({ value, onChange, placeholder, effectiveness }: Props) => {
  const move: ValueType<MoveOption> = MOVE_OPTIONS.find((option) => option.value === value);
  const handleChange = (option: ValueType<MoveOption>) =>
    onChange((option as MoveOption)?.value as string);

  const moveType = move?.move.type ?? '???';
  const background = TYPE_COLORS[moveType];

  return (
    <Select
      // isClearable
      openMenuOnFocus
      escapeClearsValue
      effectiveness={effectiveness}
      placeholder={placeholder}
      value={move}
      onChange={handleChange}
      options={MOVE_OPTIONS}
      styles={{
        control: (styles) => ({
          background,
          borderRadius: HEIGHT / 2,
          cursor: 'pointer',
          overflow: 'hidden',
        }),
        input: (styles) => ({
          ...styles,
          color: '', // inherit color
          padding: 0,
          margin: '0 2px',
          position: 'relative',
          top: '50%',
          transform: 'translateY(-50%)',
        }),
        clearIndicator: (styles) => ({
          ...styles,
          color: '',
        }),
      }}
      components={{
        DropdownIndicator: null,
        SingleValue,
        ValueContainer,
      }}
    />
  );
};

export default MoveSelect;
