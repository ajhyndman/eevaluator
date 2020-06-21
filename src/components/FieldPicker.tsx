import React from 'react';

import { Grid, InputLabel, Typography } from '@material-ui/core';
import AlbumOutlinedIcon from '@material-ui/icons/AlbumOutlined';
import EcoIcon from '@material-ui/icons/Eco';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import WavesIcon from '@material-ui/icons/Waves';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { Field } from '@smogon/calc';
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
              <ToggleButton value={weather}>
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
            <ToggleButton value="Grassy">
              <EcoIcon />
            </ToggleButton>
            <ToggleButton value="Electric">
              <FlashOnIcon />
            </ToggleButton>
            <ToggleButton value="Psychic">
              <AlbumOutlinedIcon />
            </ToggleButton>
            <ToggleButton value="Misty">
              <WavesIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        <Grid item xs={12}>
          <Typography>🚧 More field effects under construction. 🚧</Typography>
        </Grid>
      </Grid>
    </>
  );
};

export default FieldPicker;
