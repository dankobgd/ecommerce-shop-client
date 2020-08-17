import React from 'react';

import { FormControl, Select, MenuItem, InputLabel, FormHelperText, OutlinedInput } from '@material-ui/core';
import { nanoid } from 'nanoid';
import { useFormContext, Controller } from 'react-hook-form';

import { defaultLabel } from './helpers';

export default function MySelect({
  name,
  label = defaultLabel(name),
  options,
  margin = 'normal',
  variant = 'outlined',
  ...rest
}) {
  const { errors, control } = useFormContext();

  const labelRef = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);
  React.useEffect(() => {
    setLabelWidth(labelRef.current.offsetWidth);
  }, [labelRef]);

  return (
    <FormControl margin={margin} variant={variant} style={{ minWidth: 100 }} fullWidth>
      <InputLabel ref={labelRef} htmlFor={`${name}-outlined-select-label`}>
        {label}
      </InputLabel>
      <Controller
        as={
          <Select
            {...rest}
            fullWidth
            label={label}
            input={<OutlinedInput labelWidth={labelWidth} name={name} id={`${name}-outlined-select-label`} />}
          >
            {options.map(item => (
              <MenuItem key={nanoid()} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        }
        control={control}
        name={name}
      />
      <FormHelperText error={!!errors[name]}>{errors && errors[name] && errors[name].message}</FormHelperText>
    </FormControl>
  );
}
