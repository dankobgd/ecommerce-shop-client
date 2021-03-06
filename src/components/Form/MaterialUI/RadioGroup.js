import React from 'react';

import { RadioGroup, FormControlLabel, Radio, FormControl, FormHelperText } from '@material-ui/core';
import { nanoid } from 'nanoid';
import { useFormContext, Controller } from 'react-hook-form';

import { defaultLabel } from '../helpers';

export default function MyRadioGroup({ name, label = defaultLabel(name), row, options, defaultValue = '' }) {
  const { control, errors } = useFormContext();

  return (
    <FormControl>
      <Controller
        as={
          <RadioGroup aria-label={label} row={row}>
            {options.map(opt => (
              <FormControlLabel key={nanoid()} value={opt.value} control={<Radio />} label={opt.label} />
            ))}
          </RadioGroup>
        }
        name={name}
        control={control}
        defaultValue={defaultValue}
      />
      <FormHelperText error={!!errors[name]} margin='dense' variant='outlined'>
        {errors && errors[name] && errors[name].message}
      </FormHelperText>
    </FormControl>
  );
}
