import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Controller } from 'react-hook-form';

import { countries } from './countries';

function countryToFlag(isoCode) {
  return typeof String.fromCodePoint !== 'undefined'
    ? isoCode.toUpperCase().replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397))
    : isoCode;
}

function CountrySelect({ control }) {
  return (
    <Controller
      render={props => (
        <Autocomplete
          {...props}
          options={countries}
          getOptionLabel={option => option.label}
          renderOption={option => (
            <span>
              {countryToFlag(option.code)}
              {option.label}
            </span>
          )}
          renderInput={params => <TextField {...params} label='Choose a country' variant='outlined' />}
          onChange={(_, data) => props.onChange(data)}
        />
      )}
      name='country'
      control={control}
    />
  );
}

export default CountrySelect;
