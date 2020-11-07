import React from 'react';

import { TextField } from '@material-ui/core';
import { useFormContext } from 'react-hook-form';

import { defaultLabel } from '../helpers';

export default function FormTextField({
  name,
  label = defaultLabel(name),
  placeholder,
  margin = 'normal',
  variant = 'outlined',
  error,
  helperText,
  ...rest
}) {
  const { register, errors } = useFormContext();

  const hasError = error || !!errors[name];
  const errText = helperText || errors?.[name]?.message;

  return (
    <TextField
      name={name}
      label={label}
      placeholder={placeholder}
      margin={margin}
      variant={variant}
      error={hasError}
      helperText={errText}
      inputRef={register()}
      {...rest}
    />
  );
}
