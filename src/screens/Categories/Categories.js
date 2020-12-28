import React from 'react';

import { makeStyles } from '@material-ui/styles';

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

  return (
    <div className={classes.root}>
      <CategoriesToolbar />
      <div className={classes.content}>
        <CategoriesTable />
      </div>
    </div>
  );
}

export default Categories;
