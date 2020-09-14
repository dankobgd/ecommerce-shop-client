import React from 'react';

import { makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
  productsGridOuter: {
    display: 'grid',
    justifyItems: 'space-between',
    alignItems: 'flex-start',
    gridTemplateColumns: 'repeat(auto-fit,minmax(250px, 1fr))',
    gridGap: '1rem',
    border: '1px solid #eee',
  },
  cardOuter: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '1rem',
    border: '1px solid #ccc',
    backgroundColor: '#fff',
  },
  cardMedia: {
    width: '100%',
    height: '320px',
    '& img ': {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
  },
  brand: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingBottom: '4px',
  },
  brandLogo: {
    '& img': {
      width: '50px',
      height: '50px',
      objectFit: 'cover',
    },
  },
  brandName: {
    marginLeft: '6px',
  },
  cardContent: {
    padding: '6px 0',
  },
}));

function ProductsGrid({ products }) {
  const classes = useStyles();
  return (
    <div className={classes.productsGridOuter}>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function ProductCard({ product }) {
  const classes = useStyles();

  return (
    <div className={classes.cardOuter}>
      <div className={classes.brand}>
        <div className={classes.brandLogo}>
          <img src={product.brand.logo} alt={product.brand.name} />
        </div>
        <div className={classes.brandName}>
          <Typography variant='subtitle1'>{product.brand.name}</Typography>
        </div>
      </div>
      <div className={classes.cardMedia}>
        <img src={product.imageUrl} alt={product.name} />
      </div>
      <div className={classes.cardContent}>
        <Typography>{product.name}</Typography>
        <Typography>{product.price}</Typography>
      </div>
    </div>
  );
}

export default ProductsGrid;
