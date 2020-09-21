import React from 'react';

import { Typography } from '@material-ui/core';

import ProductsSlider from './ProductsSlider';

function ShowcaseProducts({ products }) {
  return (
    <div style={{ marginTop: '2rem' }}>
      <Typography variant='h2' component='h2' gutterBottom>
        Featured Products
      </Typography>
      <ProductsSlider products={products} />
    </div>
  );
}

export default ShowcaseProducts;
