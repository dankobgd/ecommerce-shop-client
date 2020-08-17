import React from 'react';

import { Slider } from '@material-ui/core';
import { useFormContext, Controller } from 'react-hook-form';

export default function FormSlider({ name }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={[0, 10]}
      render={props => (
        <Slider
          fullWidth
          {...props}
          onChange={(_, value) => {
            props.onChange(value);
          }}
          valueLabelDisplay='auto'
          max={10}
          step={1}
        />
      )}
    />
  );
}
