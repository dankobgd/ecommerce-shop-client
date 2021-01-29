import React, { useContext } from 'react';

import { Button } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import ClearIcon from '@material-ui/icons/Clear';
import { nanoid } from 'nanoid';

import {
  clearAllFilters,
  clearPriceMax,
  clearPriceMin,
  setFilterQueryString,
  setHasSearched,
  setMainFilters,
  setShouldFetchAllByFilter,
  setSpecificTextFilters,
  ShopContext,
} from '../ShopContext';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    listStyle: 'none',
    padding: theme.spacing(1),
    margin: 0,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
}));

function ChipsSection() {
  const classes = useStyles();
  const { shop, dispatch } = useContext(ShopContext);

  const handleDelete = chipToDelete => () => {
    const { name, value } = chipToDelete;
    if (name === 'categories' || name === 'tags' || name === 'brands') {
      const items = shop?.mainFilters[name].filter(x => x !== value);
      dispatch(setMainFilters({ name, items }));
    } else if (name === 'priceMin') {
      dispatch(clearPriceMin());
    } else if (name === 'priceMax') {
      dispatch(clearPriceMax());
    } else {
      const items = shop?.specificFilters?.[name]?.filter(x => x !== value) ?? [];
      dispatch(setSpecificTextFilters({ name, items }));
    }
  };

  const handleClearAllFilters = () => {
    dispatch(clearAllFilters());
    dispatch(setFilterQueryString(''));
    dispatch(setShouldFetchAllByFilter(true));
    dispatch(setHasSearched(true));
  };

  const chipsArray = shop?.getChipFiltersData;

  return (
    shop?.hasFilters && (
      <Paper component='ul' className={classes.root}>
        <Button startIcon={<ClearIcon />} variant='contained' size='small' onClick={handleClearAllFilters}>
          Clear All
        </Button>
        {chipsArray?.map(data => (
          <li key={nanoid()}>
            <Chip
              color='primary'
              label={data.label.split('_').join(' ')}
              onDelete={handleDelete(data)}
              className={classes.chip}
            />
          </li>
        ))}
      </Paper>
    )
  );
}

export default ChipsSection;
