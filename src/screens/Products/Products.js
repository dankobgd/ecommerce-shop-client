import React from 'react';

import { makeStyles } from '@material-ui/styles';
import { useDispatch, useSelector } from 'react-redux';

import { selectAllProducts, productGetAll } from '../../store/product/productSlice';
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
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);

  React.useEffect(() => {
    dispatch(productGetAll());
  }, [dispatch]);

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
