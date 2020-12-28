import React from 'react';

import { makeStyles } from '@material-ui/styles';

import ProductsTable from './ProductsTable/ProductsTable';
import ProductsToolbar from './ProductsToolbar/ProductsToolbar';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3),
  },
  content: {
    marginTop: theme.spacing(2),
  },
}));

const Products = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ProductsToolbar />
      <div className={classes.content}>
        <ProductsTable />
      </div>
    </div>
  );
};

export default Products;
