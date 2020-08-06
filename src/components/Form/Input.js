import React from 'react';
import { useFormContext } from 'react-hook-form';
import { TextField } from '@material-ui/core';

import { defaultLabel } from './helpers';

function Input({ name, label = defaultLabel(name), placeholder, margin = 'normal', variant = 'outlined', ...rest }) {
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
      fullWidth
      inputRef={register}
      {...rest}
    />
  );
}

export default Input;