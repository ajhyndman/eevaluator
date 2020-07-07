import React, { ChangeEvent } from 'react';

import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { ItemName } from '@smogon/calc/dist/data/interface';

import ItemIcon from './ItemIcon';

type Props = {
  items: string[];
  item?: ItemName;
  onChange: (item: ItemName) => void;
  label?: string;
};

const ItemPicker = ({ items, item, onChange, label }: Props) => (
  <Autocomplete
    style={{ flexGrow: 1 }}
    getOptionLabel={(option) => option}
    onChange={(e: ChangeEvent<any>, value: any) => {
      onChange(value);
    }}
    options={items}
    selectOnFocus
    renderInput={(params: any) => (
      <TextField
        {...{
          ...params,
          InputProps: {
            ...params.InputProps,
            startAdornment: params.inputProps.value && <ItemIcon item={params.inputProps.value} />,
          },
        }}
        size="small"
        label={label ?? 'Item'}
        variant="outlined"
      />
    )}
    // pass empty string to ensure this input is always "controlled"
    value={item || ''}
  />
);

export default ItemPicker;
