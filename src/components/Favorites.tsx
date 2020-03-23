import React from 'react';

import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Typography,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { Pokemon } from '@smogon/calc';

import { printStats } from '../util/export';
import PokemonIcon from './PokemonIcon';

type Props = {
  favorites: Pokemon[];
  onClose: () => void;
  onDelete: (pokemon: Pokemon) => void;
  onSelect: (pokemon: Pokemon) => void;
};

const Favorites = ({ favorites, onClose, onDelete, onSelect }: Props) => {
  return (
    <>
      <DialogTitle>Saved Pokemon</DialogTitle>
      <DialogContent>
        {favorites.map((pokemon: Pokemon) => {
          const species = pokemon.name;
          const handleSelect = () => onSelect(pokemon);
          const handleDelete = (event: React.MouseEvent) => {
            // FIXME: Don't stop propagation of events!
            event.stopPropagation();
            onDelete(pokemon);
          };

          return (
            <MenuItem onClick={handleSelect}>
              <Grid item xs={12}>
                <Grid container spacing={1} alignItems="center">
                  <Grid item>
                    <PokemonIcon species={species} />
                  </Grid>
                  <Grid item style={{ flexGrow: 1 }}>
                    <Typography>{species}</Typography>
                    <Typography>{`EVs: ${printStats(0, pokemon.evs)}`}</Typography>
                  </Grid>
                  <Grid item>
                    <IconButton size="small" title="Delete" onClick={handleDelete}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Grid>
                </Grid>
              </Grid>
            </MenuItem>
          );
        })}
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="default" onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </>
  );
};

export default Favorites;
