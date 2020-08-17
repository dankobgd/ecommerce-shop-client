import React from 'react';

import { FormControlLabel, Switch } from '@material-ui/core';
import { useFormContext, Controller } from 'react-hook-form';

import { defaultLabel } from './helpers';

export default function FormSwitch({ name, label = defaultLabel(name) }) {
  const { control } = useFormContext();

  return (
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
  );
}
