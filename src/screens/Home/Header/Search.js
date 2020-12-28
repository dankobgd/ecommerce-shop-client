import React, { useState, useCallback } from 'react';

import { CircularProgress, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { debounce } from 'lodash';

import { useSearchProducts } from '../../../hooks/queries/productQueries';
import { formatPriceForDisplay } from '../../../utils/priceFormat';

function Search() {
  const [searchTerm, setSearchTerm] = useState(null);
  const [actualDebouncedSearchValue, setActualDebouncedSearchValue] = useState(null);
  const { data: searchResults, isLoading, refetch, remove } = useSearchProducts(
    { q: actualDebouncedSearchValue },
    { enabled: false, retry: false }
  );

  const searchProducts = searchValue => {
    if (searchValue) {
      setActualDebouncedSearchValue(searchValue);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceSearch = useCallback(debounce(searchProducts, 1000), []);

  const onChange = (e, value, reason) => {
    setSearchTerm(value);

    if (reason === 'clear') {
      remove();
    }
  };

  React.useEffect(() => {
    if (actualDebouncedSearchValue) {
      refetch();
    }
  }, [actualDebouncedSearchValue, refetch]);

  const onInputChange = (e, value) => {
    setSearchTerm(value);
    debounceSearch(value);
  };

  const getOptionLabel = option => option?.name || option || '';
  const getOptionSelected = (option, value) => option?.name === value?.name || true;

  return (
    <Autocomplete
      freeSolo
      value={searchTerm}
      options={searchResults ?? []}
      loading={isLoading}
      onChange={onChange}
      getOptionLabel={getOptionLabel}
      getOptionSelected={getOptionSelected}
      renderOption={option => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <img
            src={option?.imageUrl || ''}
            alt={option?.name || ''}
            style={{ width: 60, height: 60, objectFit: 'cover', marginRight: '1rem' }}
          />
          <span>{option?.name || ''}</span>
          <span style={{ marginLeft: 'auto' }}>
            {(option?.price && `$${formatPriceForDisplay(option.price)}`) || ''}
          </span>
        </div>
      )}
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
                {isLoading ? <CircularProgress color='inherit' size={20} /> : null}
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
