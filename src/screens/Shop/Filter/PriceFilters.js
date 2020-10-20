import React, { useCallback } from 'react';

import { makeStyles, Paper, Typography, TextField } from '@material-ui/core';
import _ from 'lodash';
import NumberFormat from 'react-number-format';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import searchSlice, { selectPriceValues } from '../../../store/search/searchSlice';

const CustomInput = props => <TextField {...props} size='small' variant='outlined' />;

function PriceField({
  name,
  label,
  placeholder,
  margin = 'normal',
  variant = 'outlined',
  prefix,
  value,
  thousandSeparator = true,
  ...rest
}) {
  return (
    <NumberFormat
      {...rest}
      name={name}
      margin={margin}
      placeholder={placeholder}
      variant={variant}
      thousandSeparator={thousandSeparator}
      label={label}
      prefix={prefix}
      customInput={CustomInput}
      allowNegative={false}
      value={value}
      inputProps={{ maxLength: 6 }}
    />
  );
}

const useStyles = makeStyles(() => ({
  priceWrapper: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    justifyContent: 'center',
    gap: '1rem',
  },
  pricePaper: {
    padding: '10px 1rem',
    marginTop: 0,
  },
}));

function PriceFilters() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const priceValues = useSelector(selectPriceValues, shallowEqual);

  const updatePriceMinFilter = value => {
    dispatch(searchSlice.actions.setPriceMinFilter(value));
  };
  const updatePriceMaxFilter = value => {
    dispatch(searchSlice.actions.setPriceMaxFilter(value));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncePriceMinFilter = useCallback(_.debounce(updatePriceMinFilter, 1000), []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncePriceMaxFilter = useCallback(_.debounce(updatePriceMaxFilter, 1000), []);

  const onPriceMinValueChange = values => {
    debouncePriceMinFilter(values.value);
  };
  const onPriceMaxValueChange = values => {
    debouncePriceMaxFilter(values.value);
  };

  const onPriceChange = event => {
    const { name, value } = event.target;
    dispatch(searchSlice.actions.setPriceValues({ name, value }));
  };

  return (
    <Paper className={classes.pricePaper}>
      <Typography className={classes.heading}>Price</Typography>
      <div className={classes.priceWrapper}>
        <PriceField
          name='priceMin'
          value={priceValues.priceMin}
          onChange={onPriceChange}
          onValueChange={onPriceMinValueChange}
          label='min'
          prefix='$'
        />
        <PriceField
          name='priceMax'
          value={priceValues.priceMax}
          onChange={onPriceChange}
          onValueChange={onPriceMaxValueChange}
          label='max'
          prefix='$'
        />
      </div>
    </Paper>
  );
}

export default PriceFilters;
