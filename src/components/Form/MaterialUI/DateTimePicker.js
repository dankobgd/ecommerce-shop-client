import React from 'react';

import { TextField, FormControl, FormHelperText } from '@material-ui/core';
import { DateTimePicker } from '@material-ui/pickers';
import { Controller, useFormContext } from 'react-hook-form';

import { defaultLabel } from '../helpers';

function FormDateTimePicker({
  name,
  label = defaultLabel(name),
  placeholder,
  inputFormat = 'dd/MM/yyyy hh:mm',
  margin = 'normal',
  variant = 'outlined',
  fullWidth,
  defaultValue = null,
  ...rest
}) {
  const { control, errors } = useFormContext();

  return (
    <FormControl margin={margin} variant={variant} fullWidth={fullWidth} style={{ minWidth: 100 }}>
      <Controller
        as={
          <DateTimePicker
            {...rest}
            renderInput={props => <TextField variant='outlined' {...props} />}
            autoOk
            ampm={false}
            inputFormat={inputFormat}
            label={label}
          />
        }
        defaultValue={defaultValue}
        control={control}
        name={name}
        placeholder={placeholder}
      />
      <FormHelperText error={!!errors[name]} margin='dense' variant={variant}>
        {errors && errors[name] && errors[name].message}
      </FormHelperText>
    </FormControl>
  );
}

export default FormDateTimePicker;
