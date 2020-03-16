import React, { ChangeEvent, useState } from 'react';

import {
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Slider,
  Switch,
  Tab,
  Tabs,
  TextField,
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import { Autocomplete } from '@material-ui/lab';
import { ABILITIES, ITEMS, NATURES, Pokemon, SPECIES, Stat, StatsTable } from '@smogon/calc';
import { Status } from '@smogon/calc/dist/pokemon';

import { TRANSITION } from '../styles';
import { clonePokemon, GENERATION, getNature, STAT_LABEL } from '../util/misc';
import ItemIcon from './ItemIcon';
import StatHexagon from './StatHexagon';
import StatusLabel from './StatusLabel';
import TypeIcon from './TypeIcon';

type ModernStat = Exclude<Stat, 'spc'>;

type Props = {
  pokemon: Pokemon;
  onChange: (pokemon: Pokemon) => void;
  onExportClick: () => void;
};

const STATUS: Status[] = [
  'Healthy',
  'Paralyzed',
  'Poisoned',
  // 'Badly Poisoned',
  'Burned',
  'Asleep',
  'Frozen',
];

function PokemonPicker({ pokemon, onChange, onExportClick }: Props) {
  const [statTab, setStatTab] = useState(1);
  const statKey = statTab === 0 ? 'ivs' : 'evs';

  const nature = pokemon.nature;
  const [plusStat, minusStat] = NATURES[nature];
  const setPlusStat = (value: ModernStat) => {
    const minusStat = NATURES[nature][1];
    const nextNature = getNature(value, minusStat);

    onChange(clonePokemon(pokemon, { nature: nextNature }));
  };
  const setMinusStat = (value: ModernStat) => {
    const plusStat = NATURES[nature][0];
    const nextNature = getNature(plusStat, value);

    onChange(clonePokemon(pokemon, { nature: nextNature }));
  };

  const handleStatsChange = (stats: StatsTable<number>) => {
    const nextPokemon = clonePokemon(pokemon, { [statKey]: stats });

    // for convenience, if pokemon was at full health, ensure it's still at
    // full health.
    const isFullHp = pokemon.curHP === pokemon.maxHP();
    if (isFullHp) {
      nextPokemon.curHP = nextPokemon.maxHP();
    }
    onChange(nextPokemon);
  };
  const stats = pokemon[statKey];
  const pokemonName = pokemon.name;

  const setIsMax = (nextIsMax: boolean) => {
    const curHpFraction = pokemon.curHP / pokemon.maxHP();

    const nextPokemon = clonePokemon(pokemon, { isDynamaxed: nextIsMax });
    nextPokemon.curHP = Math.floor(curHpFraction * nextPokemon.maxHP());
    onChange(nextPokemon);
  };
  const isMax = pokemon.isDynamaxed || false;

  const setSpecies = (nextSpecies: string) => {
    if (nextSpecies != null) {
      onChange(new Pokemon(GENERATION, nextSpecies, { level: 50 }));
    }
  };

  const setAbility = (nextAbility: string) =>
    onChange(clonePokemon(pokemon, { ability: nextAbility }));
  const ability = pokemon.ability;

  const setItem = (nextItem: string) => onChange(clonePokemon(pokemon, { item: nextItem }));
  const item = pokemon.item;

  const setCurrentHp = (nextHp: number) => onChange(clonePokemon(pokemon, { curHP: nextHp }));
  const currentHp = pokemon.curHP;

  const setStatus = (status: Status) => onChange(clonePokemon(pokemon, { status }));

  const maxHp = pokemon.maxHP();
  const marks = [
    // {
    //   value: 0,
    //   label: 0,
    // },
    {
      value: Math.floor(maxHp / 3),
      label: '33%',
    },
    {
      value: Math.floor(maxHp * 0.5),
      label: '50%',
    },
    // {
    //   value: maxHp,
    //   label: maxHp,
    // },
  ];

  const setBoosts = (boosts: StatsTable) => onChange(clonePokemon(pokemon, { boosts }));
  const boosts = pokemon.boosts;

  return (
    <>
      <Grid item xs={12} style={{ display: 'flex', flexDirection: 'row' }}>
        <Grid container alignItems="center" spacing={1}>
          <Grid item style={{ flexGrow: 1 }}>
            <Autocomplete
              getOptionLabel={option => option}
              onChange={(e: ChangeEvent<any>, value: any) => {
                setSpecies(value);
              }}
              options={Object.keys(SPECIES[GENERATION])}
              renderInput={params => (
                <TextField
                  {...params}
                  size="small"
                  style={{ flexGrow: 1 }}
                  label="Pokemon"
                  variant="outlined"
                />
              )}
              value={pokemonName}
            />
          </Grid>
          <Grid item>
            <IconButton size="small" onClick={onExportClick} title="import">
              <EditIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} style={{ alignItems: 'center', display: 'flex' }}>
        <TypeIcon type={pokemon.type1} />
        <div style={{ width: 8 }} />
        {pokemon.type2 && (
          <>
            <TypeIcon type={pokemon.type2} />
            <div style={{ width: 8 }} />
          </>
        )}
        <TextField
          size="small"
          variant="outlined"
          SelectProps={{ autoWidth: true, style: { width: 175 } }}
          select
          label="Status"
          value={pokemon.status === 'Healthy' ? '' : pokemon.status}
          onChange={(event: any) => setStatus(event.target.value)}
        >
          {STATUS.map(status => (
            <MenuItem key={status} value={status}>
              <StatusLabel status={status} />
            </MenuItem>
          ))}
        </TextField>
        <FormControlLabel
          control={
            <Switch
              checked={isMax}
              onChange={(e: any, value: any) => setIsMax(value)}
              color="primary"
            />
          }
          style={{ flexGrow: 1 }}
          label="Dynamax"
          labelPlacement="start"
        />
      </Grid>

      <Grid item xs={12}>
        <Tabs centered value={statTab} onChange={(e: any, value) => setStatTab(value)}>
          <Tab label="IV" />
          <Tab label="EV" />
        </Tabs>
      </Grid>

      <Grid item xs={12}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              backgroundImage:
                pokemon &&
                `url(https://img.pokemondb.net/artwork/${pokemonName.toLocaleLowerCase()}.jpg)`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              filter: 'opacity(25%)',
              mixBlendMode: 'multiply',
              transform: pokemon.isDynamaxed ? 'scale(2, 2)' : '',
              transition: `transform ${TRANSITION}`,
              zIndex: -1,
            }}
          />
          <StatHexagon
            boosts={boosts}
            onBoostsChange={setBoosts}
            natureFavoredStat={plusStat!}
            natureUnfavoredStat={minusStat!}
            onStatsChange={handleStatsChange}
            realStats={{ ...pokemon.stats, hp: pokemon.maxHP() }}
            statKey={statKey}
            stats={stats}
          />
        </div>
      </Grid>
      <Grid item xs={2} />
      <Grid item xs={2} style={{ display: 'flex', alignItems: 'center' }}>
        <Typography align="right" style={{ flexGrow: 1 }}>
          {nature}
        </Typography>
      </Grid>
      <Grid item xs={3}>
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          select
          label="↑"
          value={plusStat}
          onChange={(event: any) => setPlusStat(event.target.value)}
        >
          {(['atk', 'def', 'spa', 'spd', 'spe'] as ModernStat[]).map(stat => (
            <MenuItem key={stat} value={stat}>
              {STAT_LABEL[stat]}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={3}>
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          select
          label="↓"
          value={minusStat}
          onChange={(event: any) => setMinusStat(event.target.value)}
        >
          {(['atk', 'def', 'spa', 'spd', 'spe'] as ModernStat[]).map(stat => (
            <MenuItem key={stat} value={stat}>
              {STAT_LABEL[stat]}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={2} />
      <Grid item xs={6}>
        <Autocomplete
          style={{ flexGrow: 1 }}
          getOptionLabel={option => option}
          onChange={(e: ChangeEvent<any>, value: any) => {
            setItem(value);
          }}
          options={ITEMS[GENERATION]}
          renderInput={(params: any) => (
            <TextField
              {...{
                ...params,
                InputProps: {
                  ...params.InputProps,
                  startAdornment: params.inputProps.value && (
                    <ItemIcon item={params.inputProps.value} />
                  ),
                },
              }}
              size="small"
              label="Item"
              variant="outlined"
            />
          )}
          // pass empty string to ensure this input is always "controlled"
          value={item || ''}
        />
      </Grid>
      <Grid item xs={6}>
        <Autocomplete
          style={{ flexGrow: 1 }}
          getOptionLabel={option => option}
          onChange={(e: ChangeEvent<any>, value: any) => {
            setAbility(value);
          }}
          options={ABILITIES[GENERATION]}
          renderInput={params => (
            <TextField {...params} size="small" label="Ability" variant="outlined" />
          )}
          value={ability}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography gutterBottom>Current HP</Typography>
        <Slider
          min={0}
          max={maxHp}
          value={currentHp}
          onChange={(e: any, value: any) => setCurrentHp(value)}
          valueLabelDisplay="auto"
          marks={marks}
        />
      </Grid>
    </>
  );
}

export default PokemonPicker;
