import { compose, drop, pickBy, prop, sortBy, toLower } from 'ramda';
import Select, {
  components,
  IndicatorProps,
  SingleValueProps,
  ValueContainerProps,
  ValueType,
} from 'react-select';

import { MOVES, Pokemon } from '@smogon/calc';
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
  attacker?: Pokemon;
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
      <img
        style={{ paddingLeft: 4, position: 'relative' }}
        src={CATEGORY_ICONS[moveCategory].src}
      />
    )}
  </div>
);

const ClearIndicator = (props: IndicatorProps<MoveOption>) => {
  const {
    selectProps: { menuIsOpen },
  } = props;
  return !menuIsOpen ? null : <components.ClearIndicator {...props} />;
};

const SingleValue = ({
  children,
  innerProps,
  selectProps: { effectiveness, move },
}: SingleValueProps<MoveOption>) => (
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

const ValueContainer = ({
  children,
  selectProps: { menuIsOpen, move },
}: ValueContainerProps<MoveOption>) => {
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
        flexGrow: 1,
      }}
    >
      <div style={{ flexGrow: 1, position: 'relative' }}>{children}</div>
      {!menuIsOpen && <MoveStats basePower={basePower} moveCategory={moveCategory} />}
    </div>
  );
};

const MoveSelect = ({ value, onChange, placeholder, effectiveness, attacker }: Props) => {
  const currentOption: ValueType<MoveOption> = MOVE_OPTIONS.filter(
    (option) => option.value === value,
  );
  const handleChange = (option: ValueType<MoveOption>) =>
    onChange((option as MoveOption)?.value as string);

  const move =
    value == null
      ? value
      : new Move(GENERATION, value, {
          useMax: attacker?.isDynamaxed,
          species: attacker?.name,
        });
  let moveType = move?.type ?? '???';
  if (move?.name === 'Tera Blast' && attacker?.teraType != null) {
    moveType = attacker?.teraType;
  }
  if (move?.name === 'Raging Bull') {
    if (attacker?.name === 'Tauros-Paldea') move.type = 'Fighting';
    if (attacker?.name === 'Tauros-Paldea-Fire') move.type = 'Fire';
    if (attacker?.name === 'Tauros-Paldea-Water') move.type = 'Water';
  }
  const background = TYPE_COLORS[moveType];

  return (
    <Select
      // custom props
      effectiveness={effectiveness}
      move={move}
      // react-select props
      isClearable
      openMenuOnFocus
      escapeClearsValue
      placeholder={placeholder}
      value={currentOption}
      getOptionLabel={prop('value')}
      onChange={handleChange}
      options={MOVE_OPTIONS}
      styles={{
        control: () => ({
          display: 'flex',
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
        ClearIndicator,
      }}
    />
  );
};

export default MoveSelect;
