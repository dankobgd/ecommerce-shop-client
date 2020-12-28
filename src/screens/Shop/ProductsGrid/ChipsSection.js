import React, { useContext } from 'react';

import { Button } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { nanoid } from 'nanoid';

import { ShopContext } from '../ShopContext';

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

function ChipsSection({
  setHasSearched,
  setFilterQueryString,
  setShouldFetchAllByFilter,
  setShouldShowDefaultProducts,
}) {
  const classes = useStyles();
  const {
    hasFilters,
    mainFilters,
    specificFilters,
    getChipFiltersData,
    setMainFilters,
    setSpecificTextFilters,
    clearPriceMin,
    clearPriceMax,
    clearAllFilters,
  } = useContext(ShopContext);

  const handleDelete = chipToDelete => () => {
    const { name, value } = chipToDelete;
    if (name === 'categories' || name === 'tags' || name === 'brands') {
      const items = mainFilters[name].filter(x => x !== value);
      setMainFilters({ name, items });
    } else if (name === 'priceMin') {
      clearPriceMin();
    } else if (name === 'priceMax') {
      clearPriceMax();
    } else {
      const items = specificFilters[name].filter(x => x !== value);
      setSpecificTextFilters({ name, items });
    }
  };

  const handleClearAllFilters = () => {
    clearAllFilters();
    setFilterQueryString('');
    setShouldFetchAllByFilter(true);
    setShouldShowDefaultProducts(true);
    setHasSearched(true);
  };

  const chipsArray = getChipFiltersData();

  return (
    hasFilters && (
      <Paper component='ul' className={classes.root}>
        <Button variant='contained' size='small' onClick={handleClearAllFilters}>
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
