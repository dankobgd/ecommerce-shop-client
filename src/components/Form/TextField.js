import React from 'react';

import { TextField } from '@material-ui/core';
import { useFormContext } from 'react-hook-form';

import { defaultLabel } from './helpers';

export default function FormTextField({
  name,
  label = defaultLabel(name),
  placeholder,
  margin = 'normal',
  variant = 'outlined',
  ...rest
}) {
  const { register, errors } = useFormContext();

  return (
    <TextField
      name={name}
      label={label}
      placeholder={placeholder}
      margin={margin}
      variant={variant}
      error={!!errors[name]}
      helperText={errors && errors[name] && errors[name].message}
      inputRef={register}
      {...rest}
    />
  );
}
