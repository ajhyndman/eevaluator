import React from 'react';

import { FormControlLabel, Grid, InputLabel, Switch, Typography } from '@material-ui/core';
import AlbumOutlinedIcon from '@material-ui/icons/AlbumOutlined';
import EcoIcon from '@material-ui/icons/Eco';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import WavesIcon from '@material-ui/icons/Waves';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { Field, Side } from '@smogon/calc';
import { Terrain, Weather } from '@smogon/calc/dist/data/interface';

import WeatherIcon from './WeatherIcon';

type Props = {
  field: Field;
  onChange: (field: Field) => void;
};

const FieldPicker = ({ field, onChange }: Props) => {
  const setWeather = (event: any, value: Weather) => {
    onChange(new Field({ ...field, weather: value }));
  };
  const setTerrain = (event: any, value: Terrain) => {
    onChange(new Field({ ...field, terrain: value }));
  };
  const setSingleTarget = (event: any, isSingleTarget: boolean) => {
    onChange(new Field({ ...field, gameType: isSingleTarget ? 'Singles' : 'Doubles' }));
  };

  const setFieldProperty = (property: keyof Field) => (event: any, value: boolean) => {
    onChange(new Field({ ...field, [property]: value }));
  };
  const setSideProperty = (property: keyof Side) => (event: any, value: boolean) => {
    onChange(
      new Field({
        ...field,
        attackerSide: { ...field.attackerSide, [property]: value },
        defenderSide: { ...field.defenderSide, [property]: value },
      }),
    );
  };

  return (
    <>
      <Grid container spacing={2} style={{ padding: 16 }}>
        <Grid item xs={6}>
          <InputLabel>
            <Typography gutterBottom variant="body2">
              Weather
            </Typography>
          </InputLabel>
          <ToggleButtonGroup size="small" exclusive value={field.weather} onChange={setWeather}>
            {(['Sun', 'Hail', 'Rain', 'Sand'] as const).map((weather) => (
              <ToggleButton value={weather} title={weather === 'Hail' ? 'Snow' : weather}>
                <WeatherIcon weather={weather} />
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Grid>
        <Grid item xs={6}>
          <InputLabel>
            <Typography gutterBottom variant="body2">
              Terrain
            </Typography>
          </InputLabel>
          <ToggleButtonGroup size="small" exclusive value={field.terrain} onChange={setTerrain}>
            <ToggleButton value="Grassy" title="Grassy Terrain">
              <EcoIcon />
            </ToggleButton>
            <ToggleButton value="Electric" title="Electric Terrain">
              <FlashOnIcon />
            </ToggleButton>
            <ToggleButton value="Psychic" title="Psychic Terrain">
              <AlbumOutlinedIcon />
            </ToggleButton>
            <ToggleButton value="Misty" title="Misty Terrain">
              <WavesIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body2">Offensive Boosts</Typography>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={field.attackerSide.isHelpingHand}
                onChange={setSideProperty('isHelpingHand')}
                color="primary"
              />
            }
            label="Helping Hand"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={field.attackerSide.isBattery}
                onChange={setSideProperty('isBattery')}
                color="primary"
              />
            }
            label="Battery"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={field.attackerSide.isPowerSpot}
                onChange={setSideProperty('isPowerSpot')}
                color="primary"
              />
            }
            label="Power Spot"
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body2">Defensive Boosts</Typography>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={field.attackerSide.isAuroraVeil}
                onChange={setSideProperty('isAuroraVeil')}
                color="primary"
              />
            }
            label="Light Screen / Reflect"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={field.attackerSide.isFriendGuard}
                onChange={setSideProperty('isFriendGuard')}
                color="primary"
              />
            }
            label="Friend Guard"
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body2">Other</Typography>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={field.gameType === 'Singles'}
                onChange={setSingleTarget}
                color="primary"
              />
            }
            label="Single Target"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={field.attackerSide.isTailwind}
                onChange={setSideProperty('isTailwind')}
                color="primary"
              />
            }
            label="Tailwind"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={field.isBeadsOfRuin}
                onChange={setFieldProperty('isBeadsOfRuin')}
                color="primary"
              />
            }
            label="Beads of Ruin (Sp. Def)"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={field.isSwordOfRuin}
                onChange={setFieldProperty('isSwordOfRuin')}
                color="primary"
              />
            }
            label="Sword of Ruin (Defense)"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={field.isTabletsOfRuin}
                onChange={setFieldProperty('isTabletsOfRuin')}
                color="primary"
              />
            }
            label="Tablets of Ruin (Attack)"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={field.isVesselOfRuin}
                onChange={setFieldProperty('isVesselOfRuin')}
                color="primary"
              />
            }
            label="Vessel of Ruin (Sp. Atk)"
          />
        </Grid>
      </Grid>
    </>
  );
};

export default FieldPicker;
