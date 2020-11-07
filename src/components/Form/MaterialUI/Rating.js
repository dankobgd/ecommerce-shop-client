import React from 'react';

import { FormControl, FormHelperText } from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import { useFormContext, Controller } from 'react-hook-form';

export default function FormNumberField({ name, variant = 'outlined', ...rest }) {
  const { control, errors, setValue, trigger } = useFormContext();

  return (
    <FormControl {...rest}>
      <Controller
        name={name}
        control={control}
        defaultValue={0}
        render={props => (
          <Rating
            name={name}
            value={props.value}
            onChange={(_, value) => {
              props.onChange();
              setValue(name, value ? Number.parseInt(value) : 0);
              trigger(name);
            }}
          />
        )}
      />
      <FormHelperText error={!!errors[name]} margin='dense' variant={variant}>
        {errors && errors[name] && errors[name].message}
      </FormHelperText>
    </FormControl>
  );
}
