import React from 'react';

import { makeStyles } from '@material-ui/styles';
import { useQuery, useQueryCache } from 'react-query';

import api from '../../api';
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
  const cache = useQueryCache();

  const info = useQuery('products', () => api.products.getAll(), {
    initialData: () => cache.getQueryData('products'),
  });

  return (
    <div className={classes.root}>
      <ProductsToolbar />
      <div className={classes.content}>
        <ProductsTable info={info} />
      </div>
    </div>
  );
};

export default Products;
