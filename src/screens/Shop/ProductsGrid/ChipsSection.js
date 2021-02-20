import React, { useContext } from 'react';

import { Button } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import ClearIcon from '@material-ui/icons/Clear';
import { nanoid } from 'nanoid';
import { useQueryClient } from 'react-query';

import {
  clearAllFilters,
  clearPriceMax,
  clearPriceMin,
  setFilterQueryString,
  setMainFilters,
  setShouldRefetchProducts,
  setSpecificTextFilters,
  ShopContext,
} from '../ShopContext';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1),
    width: '100%',
    margin: 0,
  },
  list: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    listStyle: 'none',
    width: '100%',
  },
  clearBtn: {
    marginRight: 'auto',
  },
  chip: {
    margin: theme.spacing(0.5),
  },
}));

function ChipsSection({ totalProducts }) {
  const classes = useStyles();
  const { shop, dispatch } = useContext(ShopContext);

  const queryClient = useQueryClient();

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
    queryClient.removeQueries('infinite');
    dispatch(setShouldRefetchProducts(true));
    dispatch(clearAllFilters());
    dispatch(setFilterQueryString(''));
  };

  const chipsArray = shop?.getChipFiltersData;

  return (
    shop?.hasFilters && (
      <Paper component='div' className={classes.root}>
        <Button
          className={classes.clearBtn}
          startIcon={<ClearIcon />}
          variant='contained'
          size='small'
          onClick={handleClearAllFilters}
        >
          Clear All
        </Button>

        {totalProducts && (
          <Chip
            style={{
              marginLeft: '1rem',
              background: 'purple',
              color: '#fff',
              fontWeight: 'bold',
              borderRadius: '4px',
            }}
            label={`${totalProducts} results`}
          />
        )}

        <ul className={classes.list}>
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
        </ul>
      </Paper>
    )
  );
}

export default ChipsSection;
