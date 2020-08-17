import React, { useState } from 'react';

import { makeStyles } from '@material-ui/styles';

import mockData from './data';
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
  const [products] = useState(mockData);

  return (
    <div className={classes.root}>
      <ProductsToolbar />
      <div className={classes.content}>
        <ProductsTable products={products} />
      </div>
    </div>
  );
};

export default Products;
