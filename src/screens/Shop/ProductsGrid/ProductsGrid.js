import React from 'react';

import { CircularProgress, makeStyles, Typography } from '@material-ui/core';

import ProductCard, { SkeletonCard } from '../../../components/ProductCard/ProductCard';
import ChipsSection from './ChipsSection';

const useStyles = makeStyles(() => ({
  outer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'space-between',
    border: '1px solid #eee',
  },
  mainArea: {
    display: 'flex',
    flexDirection: 'column',
  },
  chipsArea: {
    marginBottom: '1rem',
    padding: '0 1rem',
  },
  productsArea: {
    display: 'grid',
    justifyItems: 'space-between',
    alignItems: 'flex-start',
    gridTemplateColumns: 'repeat(auto-fill,minmax(250px, 1fr))',
    gridGap: '1rem',
  },
  paginationArea: {
    marginTop: '2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
  },
}));

function ProductsGrid({ products, totalProducts, loadMoreRef, isLoading, isFetchingNextPage, hasNextPage }) {
  const classes = useStyles();

  return (
    <div className={classes.outer}>
      <div className={classes.mainArea}>
        <div className={classes.chipsArea}>
          <ChipsSection totalProducts={totalProducts} />
        </div>

        {isLoading && (
          <div
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', padding: '1rem' }}
          >
            <CircularProgress size={30} />
          </div>
        )}

        {isLoading && (
          <div className={classes.productAre}>
            {new Array(20).fill().map((e, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        )}

        <div className={classes.productsArea}>
          {products?.map(product => (
            <ProductCard key={product.sku} product={product} isLoading={isLoading} />
          ))}
        </div>

        {isFetchingNextPage && (
          <div
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', padding: '1rem' }}
          >
            <CircularProgress size={30} />
          </div>
        )}

        {!hasNextPage && products?.length > 20 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              padding: '1rem',
              marginTop: '1rem',
            }}
          >
            <span>No more results</span>
          </div>
        )}

        <div ref={loadMoreRef} className='dummy' />

        {products?.length === 0 && !isLoading && (
          <div style={{ padding: '2rem' }}>
            <Typography variant='h4'>No products found matching the search criteria</Typography>
            <Typography variant='subtitle2' style={{ marginTop: '10px' }}>
              Broaden your search filters to find more products
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
}
export default ProductsGrid;
