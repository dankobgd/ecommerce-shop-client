import React from 'react';

import { Typography } from '@material-ui/core';

import { useFeaturedProducts } from '../../../hooks/queries/productQueries';
import ProductsSlider from './ProductsSlider';

function ShowcaseProducts() {
  const { data: products } = useFeaturedProducts();

  return (
    <div style={{ marginTop: '2rem' }}>
      <Typography variant='h2' component='h2' gutterBottom>
        Featured Products
      </Typography>
      <ProductsSlider products={products?.data} />
    </div>
  );
}

export default ShowcaseProducts;
