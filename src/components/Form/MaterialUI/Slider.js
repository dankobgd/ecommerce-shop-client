import React from 'react';

import { Slider } from '@material-ui/core';
import { useFormContext, Controller } from 'react-hook-form';

export default function FormSlider({ name, step = 1, max = 10 }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={props => (
        <Slider
          {...props}
          onChange={(_, value) => {
            props.onChange(value);
          }}
          valueLabelDisplay='auto'
          max={max}
          step={step}
        />
      )}
    />
  );
}
