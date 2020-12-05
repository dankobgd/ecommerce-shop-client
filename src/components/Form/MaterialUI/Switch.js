import React from 'react';

import { FormControlLabel, Switch, FormControl, FormHelperText } from '@material-ui/core';
import { useFormContext, Controller } from 'react-hook-form';

import { defaultLabel } from '../helpers';

export default function FormSwitch({ name, label = defaultLabel(name), error, helperText, defaultValue = false }) {
  const { control, errors } = useFormContext();

  const hasError = error || !!errors?.[name];
  const errText = helperText || errors?.[name]?.message;

  return (
    <FormControl>
      <FormControlLabel
        label={label}
        control={
          <Controller
            name={name}
            control={control}
            defaultValue={defaultValue}
            render={props => <Switch onChange={e => props.onChange(e.target.checked)} checked={props.value} />}
          />
        }
      />
      <FormHelperText error={hasError} margin='dense' variant='outlined'>
        {errText}
      </FormHelperText>
    </FormControl>
  );
}
