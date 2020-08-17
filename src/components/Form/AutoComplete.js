import React from 'react';

import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { Controller, useFormContext } from 'react-hook-form';

import { defaultLabel } from './helpers';

export default function AutoComplete({
  name,
  label = defaultLabel(name),
  variant = 'outlined',
  margin = 'normal',
  options,
  ...rest
}) {
  const { control } = useFormContext();

  return (
    <Controller
      render={props => (
        <Autocomplete
          {...rest}
          {...props}
          options={options}
          autoHighlight
          renderInput={params => <TextField {...params} label={label} margin={margin} variant={variant} />}
          onChange={(_, data) => props.onChange(data)}
        />
      )}
      name={name}
      control={control}
    />
  );
}
