import React from 'react';

import { makeStyles, Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';

import ProductCard from '../../../components/ProductCard/ProductCard';
import { selectPaginationMeta } from '../../../store/search/searchSlice';
import { calculatePaginationStartEndPosition } from '../../../utils/pagination';
import PaginationRanges from '../Pagination/Pagination';
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

function ProductsGrid({ products, hasSearched }) {
  const classes = useStyles();
  const paginationMeta = useSelector(selectPaginationMeta);

  const { start, end } = calculatePaginationStartEndPosition(paginationMeta?.page, paginationMeta?.perPage);

  return (
    <div className={classes.outer}>
      <div className={classes.mainArea}>
        <div className={classes.chipsArea}>
          <ChipsSection />
        </div>

        <div className={classes.productAre}>
          {paginationMeta &&
            products.length > 0 &&
            products.slice(start, end).map(product => <ProductCard key={product.sku} product={product} />)}
        </div>

        {products.length === 0 && !hasSearched && (
          <div style={{ padding: '2rem' }}>
            <Typography variant='h4'>Choose filters from the sidebar to search products</Typography>
            <Typography variant='subtitle2' style={{ marginTop: '10px' }}>
              Filter by category, tags, brands, price as well as product specific variants
            </Typography>
          </div>
        )}
        {products.length === 0 && hasSearched && (
          <div style={{ padding: '2rem' }}>
            <Typography variant='h4'>No products found matching the search criteria</Typography>
            <Typography variant='subtitle2' style={{ marginTop: '10px' }}>
              Try broadening the search filters to get better results
            </Typography>
          </div>
        )}
      </div>
      {paginationMeta && paginationMeta.totalCount !== -1 && paginationMeta.pageCount !== 1 && (
        <div className={classes.paginationArea}>
          <PaginationRanges
            page={paginationMeta.page}
            perPage={paginationMeta.perPage}
            pageCount={paginationMeta.pageCount}
          />
        </div>
      )}
    </div>
  );
}
export default ProductsGrid;
