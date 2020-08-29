import React from 'react';

import { TextField, FormControl, FormHelperText } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { Controller, useFormContext } from 'react-hook-form';

import { defaultLabel } from '../helpers';

export default function AutoComplete({
  name,
  label = defaultLabel(name),
  variant = 'outlined',
  margin = 'normal',
  fullWidth,
  options,
  ...rest
}) {
  const { control, errors } = useFormContext();

  return (
    <FormControl fullWidth={fullWidth}>
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
      <FormHelperText error={!!errors[name]}>{errors && errors[name] && errors[name].message}</FormHelperText>
    </FormControl>
  );
}
