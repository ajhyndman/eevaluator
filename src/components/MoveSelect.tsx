import { compose, drop, pickBy, prop, sortBy, toLower } from 'ramda';
import Select, { SingleValueProps, ValueContainerProps, ValueType } from 'react-select';

import { MOVES } from '@smogon/calc';
import { MoveCategory, SpeciesName } from '@smogon/calc/dist/data/interface';
import { MoveData } from '@smogon/calc/dist/data/moves';
import { Move } from '@smogon/calc/dist/move';

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
  isMax?: boolean;
  // needed to correctly identify gmax moves
  attackerSpecies?: string;
};

type MoveOption = {
  value: string;
};

const HEIGHT = 40;

export const USEFUL_MOVES: { [name: string]: MoveData } = pickBy(
  (move) => !(move.isMax || move.category == null),
  MOVES[GENERATION.num],
);

const MOVE_OPTIONS = sortBy(compose(toLower, prop('value')))(
  drop(
    1,
    Object.keys(USEFUL_MOVES).map((name) => ({
      value: name,
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

const MoveStats = ({
  basePower,
  moveCategory,
}: {
  basePower: number;
  moveCategory: MoveCategory;
}) => (
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
        background: '#555555',
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
      <img style={{ paddingLeft: 4, position: 'relative' }} src={CATEGORY_ICONS[moveCategory]} />
    )}
  </div>
);

const SingleValue = ({
  children,
  innerProps,
  selectProps: { effectiveness, move },
}: SingleValueProps<MoveOption>) => {
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
        {move?.name ?? children}
      </span>
      {effectiveness && <span style={{ display: 'block', fontSize: 10 }}>{effectiveness}</span>}
    </div>
  );
};

const ValueContainer = ({ children, selectProps: { move } }: ValueContainerProps<MoveOption>) => {
  const moveCategory: MoveCategory = move?.category;
  const basePower = (move?.bp || '—').toString();

  return (
    <div
      style={{
        boxSizing: 'border-box',
        height: HEIGHT,
        padding: '2px 8px 2px 16px',
        position: 'relative',
        display: 'flex',
      }}
    >
      <div style={{ flexGrow: 1, position: 'relative' }}>{children}</div>
      <MoveStats basePower={basePower} moveCategory={moveCategory} />
    </div>
  );
};

const MoveSelect = ({
  value,
  onChange,
  placeholder,
  effectiveness,
  isMax = false,
  attackerSpecies,
}: Props) => {
  const currentOption: ValueType<MoveOption> = MOVE_OPTIONS.filter(
    (option) => option.value === value,
  );
  const handleChange = (option: ValueType<MoveOption>) =>
    onChange((option as MoveOption)?.value as string);

  const move =
    value == null
      ? value
      : new Move(GENERATION, value, {
          useMax: isMax,
          species: attackerSpecies as SpeciesName,
        });
  const moveType = move?.type ?? '???';
  const background = TYPE_COLORS[moveType];

  return (
    <Select
      // custom props
      effectiveness={effectiveness}
      move={move}
      // react-select props
      // isClearable
      openMenuOnFocus
      escapeClearsValue
      placeholder={placeholder}
      value={currentOption}
      getOptionLabel={prop('value')}
      onChange={handleChange}
      options={MOVE_OPTIONS}
      styles={{
        control: () => ({
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
