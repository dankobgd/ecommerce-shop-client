import React from 'react';

import { FormControl, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { Controller, useFormContext } from 'react-hook-form';

function Search({ options, ...rest }) {
  const getOptionLabel = option => option.title || '';
  const getOptionSelected = (option, value) => option.title === value.title;
  // const renderOption = (option, state) => option;

  const { control, setValue } = useFormContext();

  const onChange = (e, value, reason) => value;

  const onInputChange = (e, value) => {
    setValue('search', value);
    console.log('input change value: ', value);
    return value;
  };

  return (
    <FormControl {...rest} fullWidth>
      <Controller
        name='search'
        control={control}
        defaultValue=''
        onChange={([e, value, reason]) => onChange(e, value, reason)}
        onInputChange={(e, value) => onInputChange(e, value)}
        render={props => (
          <Autocomplete
            id='search'
            freeSolo
            autoSelect
            autoHighlight
            getOptionLabel={getOptionLabel}
            getOptionSelected={getOptionSelected}
            options={options}
            renderInput={params => (
              <TextField
                {...params}
                label='Search'
                margin='normal'
                variant='outlined'
                inputProps={{
                  ...params.inputProps,
                  onChange: e => {
                    onInputChange(e, e.target.value || null);
                    params.inputProps.onChange(e);
                  },
                }}
              />
            )}
          />
        )}
      />
    </FormControl>
  );
}

export default Search;

/*
<Autocomplete
  freeSolo
  options={tagsList}
  loading={tagsLoading}
  onChange={onTagInputChange}
  value={tagInputValue}
  renderInput={props => (
    <TextField
      {...props}
      label="Tag (filter)"
      variant="outlined"
      fullWidth
      inputProps={{
        ...props.inputProps,
        onChange: e => {
          onTagInputChange(e, e.target.value || null);
          props.inputProps.onChange(e);
        },
      }}
    />
  )}
/> 
*/
