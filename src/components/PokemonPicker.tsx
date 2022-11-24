import { sortBy, toLower } from 'ramda';
import React, { ChangeEvent, useState } from 'react';

import { Grid, IconButton, MenuItem, Slider, Switch, TextField } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import FolderSpecialIcon from '@material-ui/icons/FolderSpecial';
import SaveIcon from '@material-ui/icons/Save';
import { Autocomplete } from '@material-ui/lab';
import { ABILITIES, Field, ITEMS, NATURES, Pokemon, SPECIES, StatsTable } from '@smogon/calc';
import {
  AbilityName,
  ItemName,
  StatID,
  StatusName,
  TypeName,
} from '@smogon/calc/dist/data/interface';

import { clonePokemon, GENERATION, getNature, STAT_LABEL } from '../util/misc';
import ItemPicker from './ItemPicker';
import PokemonIllustration, { TYPES } from './PokemonIllustration';
import StatHexagon from './StatHexagon';
import StatusLabel, { STATUS } from './StatusLabel';
import TypeIcon from './TypeIcon';

type ModernStat = Exclude<StatID, 'spc'>;

type Props = {
  index: number;
  pokemon: Pokemon;
  field: Field;
  onChange: (pokemon: Pokemon) => void;
  onExportClick: () => void;
  onSaveFavorite: (pokemon: Pokemon) => void;
  onOpenFavorites: () => void;
};

function PokemonPicker({
  index,
  pokemon,
  field,
  onChange,
  onExportClick,
  onOpenFavorites,
  onSaveFavorite,
}: Props) {
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
    let curHP = pokemon.curHP();
    const isFullHp = curHP === pokemon.maxHP();

    // Workaround: In @smogon/calc@0.3.0 curHP needs to be specified as if
    // pokemon is not dynamaxed.
    const nextHP = pokemon.isDynamaxed ? Math.floor(curHP / 2) : curHP;

    const nextPokemon = clonePokemon(pokemon, {
      [statKey]: stats,
      // for convenience, if pokemon was at full health, ensure it's still at
      // full health.
      originalCurHP: isFullHp ? undefined : nextHP,
    });

    onChange(nextPokemon);
  };
  const stats = pokemon[statKey];
  const pokemonName = pokemon.name;

  const setTeraType = (nextTeraType?: TypeName) => {
    const nextPokemon = clonePokemon(pokemon, {
      teraType: nextTeraType,
    });
    onChange(nextPokemon);
  };
  const teraType = pokemon.teraType;

  const setSpecies = (nextSpecies: string) => {
    if (nextSpecies != null) {
      onChange(new Pokemon(GENERATION, nextSpecies, { level: 50 }));
    }
  };

  const setAbility = (nextAbility: AbilityName) =>
    onChange(clonePokemon(pokemon, { ability: nextAbility }));
  const ability = pokemon.ability;

  const setItem = (nextItem: ItemName) => onChange(clonePokemon(pokemon, { item: nextItem }));
  const item = pokemon.item;

  const setCurrentHp = (curHP: number) => {
    const nextHp = pokemon.isDynamaxed ? Math.floor(curHP / 2) : curHP;
    onChange(clonePokemon(pokemon, { curHP: nextHp }));
  };
  const currentHp = pokemon.curHP();

  const setStatus = (status: StatusName) => onChange(clonePokemon(pokemon, { status }));

  const maxHp = pokemon.maxHP();
  const marks = [
    {
      value: Math.floor(maxHp / 3),
      label: '33%',
    },
    {
      value: Math.floor(maxHp * 0.5),
      label: '50%',
    },
  ];

  const setBoosts = (boosts: StatsTable) => onChange(clonePokemon(pokemon, { boosts }));
  const boosts = pokemon.boosts;

  const sortCaseInsensitive = sortBy(toLower);
  const abilityOptions = sortCaseInsensitive(ABILITIES[GENERATION.num]);
  const speciesOptions = sortCaseInsensitive(Object.keys(SPECIES[GENERATION.num]));
  const itemOptions = sortCaseInsensitive(ITEMS[GENERATION.num]);

  return (
    <>
      {/* Species Input */}
      <Grid item xs={12} style={{ display: 'flex', flexDirection: 'row' }}>
        <Grid container alignItems="center" spacing={1}>
          <Grid item style={{ flexGrow: 1 }}>
            <Autocomplete
              getOptionLabel={(option) => option}
              onChange={(e: ChangeEvent<any>, value: any) => {
                setSpecies(value);
              }}
              options={speciesOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  style={{ flexGrow: 1 }}
                  label="Pokemon"
                  variant="outlined"
                />
              )}
              selectOnFocus
              value={pokemonName}
            />
          </Grid>
          <Grid item>
            <IconButton size="small" onClick={onOpenFavorites} title="favorites">
              <FolderSpecialIcon />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton
              size="small"
              onClick={() => onSaveFavorite(pokemon)}
              title="save to favorites"
            >
              <SaveIcon />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton size="small" onClick={onExportClick} title="import">
              <EditIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>

      {/* Pokemon type, status and Dynamax toggle */}
      <Grid item xs={12} style={{ alignItems: 'center', display: 'flex' }}>
        <TypeIcon type={teraType ?? pokemon.types[0]} />
        <div style={{ width: 8 }} />
        {!teraType && pokemon.types[1] && (
          <>
            <TypeIcon type={pokemon.types[1]} />
            <div style={{ width: 8 }} />
          </>
        )}
        <TextField
          size="small"
          variant="outlined"
          SelectProps={{ style: { width: 175 } }}
          select
          label="Status"
          value={pokemon.status}
          onChange={(event: any) => setStatus(event.target.value)}
        >
          {STATUS.map((status) => (
            <MenuItem key={status} value={status}>
              <StatusLabel status={status} />
            </MenuItem>
          ))}
        </TextField>
        <div style={{ flexGrow: 1 }} />
        <div style={{ minWidth: 125 }}>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            select
            label="Tera Type"
            value={teraType ?? ''}
            onChange={(event) => setTeraType(event.target.value as TypeName)}
          >
            <MenuItem value={undefined}>None</MenuItem>
            {Object.keys(TYPES).map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
        </div>
      </Grid>

      <Grid item xs={12}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <PokemonIllustration index={index} pokemon={pokemon} teraType={teraType} />
          <StatHexagon
            boosts={boosts}
            item={item}
            species={pokemon.species}
            onBoostsChange={setBoosts}
            natureFavoredStat={plusStat!}
            natureUnfavoredStat={minusStat!}
            onStatsChange={handleStatsChange}
            realStats={{ ...pokemon.stats, hp: pokemon.maxHP() }}
            field={field}
            statKey={statKey}
            stats={stats}
          />
          <label
            style={{
              alignItems: 'center',
              cursor: 'pointer',
              display: 'flex',
              position: 'absolute',
              bottom: 0,
              right: 0,
            }}
          >
            <Typography>IV</Typography>
            <Switch
              checked={statTab === 1}
              onChange={(e: any, value: any) => setStatTab(value ? 1 : 0)}
              color="default"
            />
            <Typography>EV</Typography>
          </label>
        </div>
      </Grid>

      {/* Nature Inputs */}
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
          {(['atk', 'def', 'spa', 'spd', 'spe'] as ModernStat[]).map((stat) => (
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
          {(['atk', 'def', 'spa', 'spd', 'spe'] as ModernStat[]).map((stat) => (
            <MenuItem key={stat} value={stat}>
              {STAT_LABEL[stat]}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={2} />

      {/* Ability Input */}
      <Grid item xs={6}>
        <Autocomplete
          style={{ flexGrow: 1 }}
          getOptionLabel={(option) => option}
          onChange={(e: ChangeEvent<any>, value: any) => {
            setAbility(value);
          }}
          options={abilityOptions}
          renderInput={(params) => (
            <TextField {...params} size="small" label="Ability" variant="outlined" />
          )}
          selectOnFocus
          value={ability}
        />
      </Grid>

      {/* Item Input */}
      <Grid item xs={6}>
        <ItemPicker items={itemOptions} item={item} onChange={setItem} />
      </Grid>

      {/* Current HP slider */}
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
