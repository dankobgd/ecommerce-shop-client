import React from 'react';

import { FormControlLabel, Checkbox, FormGroup, FormControl, FormHelperText } from '@material-ui/core';
import { nanoid } from 'nanoid';
import { useFormContext, Controller } from 'react-hook-form';

export default function CheckboxGroup({ name, row, options, getOptionLabel = option => option }) {
  const { control, errors, watch } = useFormContext();
  const [checkedValues, setCheckedValues] = React.useState(watch(name));

  function handleSelect(checkedName) {
    const newNames = checkedValues?.includes(checkedName)
      ? checkedValues?.filter(item => item !== checkedName)
      : [...(checkedValues ?? []), checkedName];
    setCheckedValues(newNames);

    return newNames;
  }

  return (
    <FormControl>
      <FormGroup row={row}>
        {options.map(opt => (
          <FormControlLabel
            control={
              <Controller
                name={name}
                render={props => (
                  <Checkbox checked={checkedValues.includes(opt)} onChange={() => props.onChange(handleSelect(opt))} />
                )}
                control={control}
              />
            }
            key={nanoid()}
            label={getOptionLabel(opt)}
          />
        ))}
      </FormGroup>
      <FormHelperText error={!!errors[name]} margin='dense' variant='outlined'>
        {errors && errors[name] && errors[name].message}
      </FormHelperText>
    </FormControl>
  );
}
