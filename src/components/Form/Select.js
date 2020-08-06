import React from 'react';
import { FormControl, TextField, MenuItem } from '@material-ui/core';
import { Controller, useFormContext } from 'react-hook-form';
import { nanoid } from 'nanoid';

import { defaultLabel } from './helpers';

function Select({
  name,
  label = defaultLabel(name),
  placeholder,
  options,
  margin = 'normal',
  variant = 'outlined',
  ...rest
}) {
  const { errors, control } = useFormContext();

  return (
    <FormControl variant={variant}>
      <Controller
        as={
          <TextField
            select
            label={label}
            placeholder={placeholder}
            margin={margin}
            variant={variant}
            error={!!errors[name]}
            helperText={errors && errors[name] && errors[name].message}
            {...rest}
          >
            {options.map(item => (
              <MenuItem key={nanoid()} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </TextField>
        }
        control={control}
        name={name}
        defaultValue=''
      />
    </FormControl>
  );
}

export default Select;
