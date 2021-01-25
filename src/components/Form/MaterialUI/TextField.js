import React from 'react';

import { TextField } from '@material-ui/core';
import _ from 'lodash';
import { Controller, useFormContext } from 'react-hook-form';

import { defaultLabel } from '../helpers';

export default function FormTextField({
  name,
  label = defaultLabel(name),
  placeholder,
  margin = 'normal',
  variant = 'outlined',
  error,
  helperText,
  defaultValue = '',
  ...rest
}) {
  const { errors, control } = useFormContext();

  const hasError = error || !!(errors && _.get(errors, name));
  const errText = helperText || (errors && _.get(errors, name)?.message);

  return (
    <Controller
      as={
        <TextField
          name={name}
          label={label}
          placeholder={placeholder}
          margin={margin}
          variant={variant}
          error={hasError}
          helperText={errText}
          {...rest}
        />
      }
      control={control}
      name={name}
      defaultValue={defaultValue}
    />
  );
}
