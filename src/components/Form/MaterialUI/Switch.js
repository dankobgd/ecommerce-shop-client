import React from 'react';

import { FormControlLabel, Switch, FormControl, FormHelperText } from '@material-ui/core';
import { useFormContext, Controller } from 'react-hook-form';

import { defaultLabel } from '../helpers';

export default function FormSwitch({ name, label = defaultLabel(name) }) {
  const { control, errors } = useFormContext();

  return (
    <FormControl>
      <FormControlLabel
        label={label}
        control={
          <Controller
            name={name}
            control={control}
            render={props => <Switch onChange={e => props.onChange(e.target.checked)} checked={props.value} />}
          />
        }
      />
      <FormHelperText error={!!errors[name]} margin='dense' variant='outlined'>
        {errors && errors[name] && errors[name].message}
      </FormHelperText>
    </FormControl>
  );
}
