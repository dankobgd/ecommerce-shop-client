import React from 'react';

import { FormControlLabel, Checkbox, FormControl, FormHelperText } from '@material-ui/core';
import { useFormContext, Controller } from 'react-hook-form';

import { defaultLabel } from '../helpers';

export default function FormCheckbox({ name, label = defaultLabel(name) }) {
  const { control, errors } = useFormContext();

  return (
    <FormControl>
      <FormControlLabel
        label={label}
        control={
          <Controller
            name={name}
            control={control}
            render={props => <Checkbox onChange={e => props.onChange(e.target.checked)} checked={props.value} />}
          />
        }
      />
      <FormHelperText error={!!errors[name]}>{errors && errors[name] && errors[name].message}</FormHelperText>
    </FormControl>
  );
}
