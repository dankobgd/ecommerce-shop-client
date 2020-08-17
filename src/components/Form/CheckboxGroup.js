import React from 'react';

import { FormControlLabel, Checkbox, FormGroup } from '@material-ui/core';
import { useFormContext, Controller } from 'react-hook-form';

export default function CheckboxGroup({ name, row, options }) {
  const { control, watch } = useFormContext();
  const [checkedValues, setCheckedValues] = React.useState(watch(name));

  function handleSelect(checkedName) {
    const newNames = checkedValues?.includes(checkedName)
      ? checkedValues?.filter(item => item !== checkedName)
      : [...(checkedValues ?? []), checkedName];
    setCheckedValues(newNames);

    return newNames;
  }

  return (
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
          key={opt}
          label={opt}
        />
      ))}
    </FormGroup>
  );
}
