import React from 'react';

import { FormControlLabel, Checkbox, FormControl, FormHelperText } from '@material-ui/core';
import { useFormContext, Controller } from 'react-hook-form';

import { defaultLabel } from '../helpers';

export default function FormCheckbox({ name, label = defaultLabel(name), defaultValue = false }) {
  const { control, errors } = useFormContext();

  return (
    <FormControl>
      <FormControlLabel
        control={
          <Controller
            name={name}
            control={control}
            render={props => (
              <Checkbox onChange={e => props.onChange(e.target.checked)} checked={props.value || false} />
            )}
          />
        }
        label={label}
        defaultValue={defaultValue}
      />
      <FormHelperText error={!!errors[name]} margin='dense' variant='outlined'>
        {errors && errors[name] && errors[name].message}
      </FormHelperText>
    </FormControl>
  );
}
