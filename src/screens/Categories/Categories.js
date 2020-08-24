import React from 'react';

import { makeStyles } from '@material-ui/styles';
import { useSelector, useDispatch } from 'react-redux';

import { categoryGetAll, selectAllCategories } from '../../store/category/categorySlice';
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
  const dispatch = useDispatch();
  const categories = useSelector(selectAllCategories);

  React.useEffect(() => {
    dispatch(categoryGetAll());
  }, [dispatch]);

  return (
    <div className={classes.root}>
      <CategoriesToolbar />
      <div className={classes.content}>
        <CategoriesTable categories={categories} />
      </div>
    </div>
  );
}

export default Categories;
