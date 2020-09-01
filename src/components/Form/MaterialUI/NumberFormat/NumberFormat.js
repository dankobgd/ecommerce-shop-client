import React from 'react';

import { TextField, FormControl, FormHelperText } from '@material-ui/core';
import { useFormContext, Controller } from 'react-hook-form';
import ReactNumberFormat from 'react-number-format';

import { defaultLabel } from '../../helpers';

export default function FormTextField({
  name,
  label = defaultLabel(name),
  placeholder,
  margin = 'normal',
  variant = 'outlined',
  prefix = '$',
  thousandSeparator = true,
  ...rest
}) {
  const { control, errors, setValue } = useFormContext();

  return (
    <FormControl {...rest}>
      <Controller
        name={name}
        control={control}
        defaultValue=''
        {...rest}
        render={props => (
          <ReactNumberFormat
            margin={margin}
            placeholder={placeholder}
            variant={variant}
            thousandSeparator={thousandSeparator}
            label={label}
            prefix={prefix}
            customInput={TextField}
            value={props.value}
            onValueChange={target => {
              props.onChange();
              setValue(name, target.value);
            }}
            onBlur={props.onBlur}
          />
        )}
      />
      <FormHelperText error={!!errors[name]} margin='dense' variant={variant}>
        {errors && errors[name] && errors[name].message}
      </FormHelperText>
    </FormControl>
  );
}
