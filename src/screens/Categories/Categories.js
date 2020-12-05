import React from 'react';

import { makeStyles } from '@material-ui/styles';
import { useQuery, useQueryCache } from 'react-query';

import api from '../../api';
import CategoriesTable from './CategoriesTable/CategoriesTable';
import CategoriesToolbar from './CategoriesToolbar/CategoriesToolbar';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3),
  },
  content: {
    marginTop: theme.spacing(2),
  },
}));

function Categories() {
  const classes = useStyles();
  const cache = useQueryCache();

  const info = useQuery('categories', () => api.categories.getAll(), {
    initialData: () => cache.getQueryData(['categories']),
  });

  return (
    <div className={classes.root}>
      <CategoriesToolbar />
      <div className={classes.content}>
        <CategoriesTable info={info} />
      </div>
    </div>
  );
}

export default Categories;
