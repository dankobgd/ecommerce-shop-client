import React, { useState, useCallback } from 'react';

import { CircularProgress, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { debounce } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';

import productSlice, { productSearch } from '../../../store/product/productSlice';
import { selectUIState } from '../../../store/ui';

function Search() {
  const dispatch = useDispatch();
  const results = useSelector(s => s.products.searchResults);
  const [search, setSearch] = useState(null);
  const { loading } = useSelector(selectUIState(productSearch));

  const searchProducts = async searchValue => {
    const params = new URLSearchParams({ q: searchValue });

    if (searchValue) {
      await dispatch(productSearch(params));
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceSearch = useCallback(debounce(searchProducts, 1000), []);

  const onChange = (e, value, reason) => {
    setSearch(value);

    if (reason === 'clear') {
      dispatch(productSlice.actions.clearSearchResults());
    }
  };

  const onInputChange = (e, value) => {
    setSearch(value);
    debounceSearch(value);
  };

  const getOptionLabel = option => option?.name || option || '';
  const getOptionSelected = (option, value) => option?.name === value?.name || true;

  return (
    <Autocomplete
      freeSolo
      value={search}
      options={results}
      loading={loading}
      onChange={onChange}
      getOptionLabel={getOptionLabel}
      getOptionSelected={getOptionSelected}
      renderInput={params => (
        <TextField
          {...params}
          label='Search'
          variant='outlined'
          fullWidth
          placeholder='Search by product name, category, brand...'
          InputProps={{
            ...params.InputProps,
            onChange: e => {
              onInputChange(e, e.target.value || null);
              params.inputProps.onChange(e);
            },
            endAdornment: (
              <>
                {loading ? <CircularProgress color='inherit' size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
            inputProps: {
              ...params.inputProps,
            },
          }}
        />
      )}
    />
  );
}

export default Search;
