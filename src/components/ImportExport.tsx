import React, { ChangeEvent, useEffect, useRef, useState } from 'react';

import { Button, DialogActions, DialogContent, DialogTitle, TextField } from '@material-ui/core';
import { MOVES, Pokemon } from '@smogon/calc';

import { exportPokemon } from '../util/export';
import { importPokemon } from '../util/import';
import { clonePokemon, GENERATION } from '../util/misc';

type Props = {
  pokemon: Pokemon;
  onImport: (pokemon: Pokemon) => void;
};

const ImportExport = ({ pokemon, onImport }: Props) => {
  const exportText = exportPokemon(pokemon);
  const [value, setValue] = useState(exportText);
  const handleValueChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  const inputRef = useRef<HTMLTextAreaElement>();
  useEffect(() => {
    inputRef.current!.select();
  }, []);

  const handleImportPokemon = () => {
    try {
      const rawPokemon = importPokemon(value);
      const sanitizedPokemon = clonePokemon(rawPokemon, {
        level: 50,
        moves: rawPokemon.moves.filter(move => Object.keys(MOVES[GENERATION]).includes(move)),
      });
      onImport(sanitizedPokemon);
    } catch (e) {
      console.warn(e);
      window.alert("Sorry, I don't recognize this Pokemon!");
    }
  };

  return (
    <>
      <DialogTitle>Import / Export Pokemon</DialogTitle>
      <DialogContent>
        <TextField
          inputRef={inputRef}
          fullWidth
          id="outlined-multiline-flexible"
          label="Your Pokemon"
          multiline
          onChange={handleValueChange}
          rows="10"
          spellCheck="false"
          value={value}
          variant="outlined"
        />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={handleImportPokemon}>
          Import
        </Button>
      </DialogActions>
    </>
  );
};

export default ImportExport;
