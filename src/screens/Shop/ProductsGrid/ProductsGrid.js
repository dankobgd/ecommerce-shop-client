import React from 'react';

import { makeStyles, Typography } from '@material-ui/core';

import ProductCard from '../../../components/ProductCard/ProductCard';
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
  productAre: {
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

function ProductsGrid({
  products,
  hasSearched,
  setHasSearched,
  setFilterQueryString,
  setShouldFetchAllByFilter,
  shouldShowDefaultProducts,
  setShouldShowDefaultProducts,
}) {
  const classes = useStyles();

  return (
    <div className={classes.outer}>
      <div className={classes.mainArea}>
        <div className={classes.chipsArea}>
          <ChipsSection
            setHasSearched={setHasSearched}
            setFilterQueryString={setFilterQueryString}
            setShouldFetchAllByFilter={setShouldFetchAllByFilter}
            setShouldShowDefaultProducts={setShouldShowDefaultProducts}
          />
        </div>

        <div className={classes.productAre}>
          {products?.map(product => (
            <ProductCard key={product.sku} product={product} />
          ))}
        </div>

        {products?.length === 0 && !hasSearched && !shouldShowDefaultProducts && (
          <div style={{ padding: '2rem' }}>
            <Typography variant='h4'>Choose filters from the sidebar to search products</Typography>
            <Typography variant='subtitle2' style={{ marginTop: '10px' }}>
              Filter by category, tags, brands, price as well as product specific variants
            </Typography>
          </div>
        )}
        {products?.length === 0 && hasSearched && (
          <div style={{ padding: '2rem' }}>
            <Typography variant='h4'>No products found matching the search criteria</Typography>
            <Typography variant='subtitle2' style={{ marginTop: '10px' }}>
              Try broadening the search filters to get better results
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
}
export default ProductsGrid;
