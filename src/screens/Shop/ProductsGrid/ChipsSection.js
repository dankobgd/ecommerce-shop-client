import React from 'react';

import { Button } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { nanoid } from 'nanoid';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import searchSlice, {
  selectChipFilters,
  selectHasFilters,
  selectMainFilters,
  selectSpecificFilters,
} from '../../../store/search/searchSlice';

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
  const dispatch = useDispatch();
  const classes = useStyles();
  const chipFilters = useSelector(selectChipFilters, shallowEqual);
  const mainFilters = useSelector(selectMainFilters, shallowEqual);
  const specificFilters = useSelector(selectSpecificFilters, shallowEqual);
  const hasFilters = useSelector(selectHasFilters);

  const handleDelete = chipToDelete => () => {
    const { name, value } = chipToDelete;

    if (name === 'categories' || name === 'tags' || name === 'brands') {
      const items = mainFilters[name].filter(x => x !== value);
      dispatch(searchSlice.actions.setMainFilters({ name, items }));
    } else if (name === 'priceMin') {
      dispatch(searchSlice.actions.clearPriceMin());
    } else if (name === 'priceMax') {
      dispatch(searchSlice.actions.clearPriceMax());
    } else {
      const items = specificFilters[name].filter(x => x !== value);
      dispatch(searchSlice.actions.setSpecificFilters({ name, items }));
    }
  };

  const clearAllFilters = () => () => {
    dispatch(searchSlice.actions.clearAllFilters());
  };

  return (
    hasFilters && (
      <Paper component='ul' className={classes.root}>
        <Button variant='contained' size='small' onClick={clearAllFilters()}>
          Clear All
        </Button>

        {chipFilters.map(data => (
          <li key={nanoid()}>
            <Chip color='primary' label={data.label} onDelete={handleDelete(data)} className={classes.chip} />
          </li>
        ))}
      </Paper>
    )
  );
}

export default ChipsSection;
