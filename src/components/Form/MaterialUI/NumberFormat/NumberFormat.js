import React from 'react';

import { TextField, FormControl, FormHelperText } from '@material-ui/core';
import { useFormContext, Controller } from 'react-hook-form';
import ReactNumberFormat from 'react-number-format';

import { defaultLabel } from '../../helpers';

export default function FormNumberField({
  name,
  label = defaultLabel(name),
  placeholder,
  margin = 'normal',
  variant = 'outlined',
  prefix,
  thousandSeparator = true,
  inputProps,
  isAllowed,
  defaultValue = '',
  allowLeadingZeros,
  format,
  mask,
  isString = false,
  ...rest
}) {
  const { control, errors, setValue, trigger } = useFormContext();

  return (
    <FormControl {...rest}>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        {...rest}
        render={props => (
          <ReactNumberFormat
            thousandSeparator={thousandSeparator}
            isAllowed={isAllowed}
            margin={margin}
            placeholder={placeholder}
            variant={variant}
            label={label}
            prefix={prefix}
            customInput={TextField}
            value={props.value}
            inputProps={inputProps}
            allowLeadingZeros={allowLeadingZeros}
            format={format}
            mask={mask}
            onValueChange={target => {
              props.onChange();
              if (isString) {
                setValue(name, target.value || defaultValue);
              } else {
                setValue(name, target.floatValue || defaultValue);
              }
              trigger(name);
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
