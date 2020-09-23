import React from 'react';

import { makeStyles } from '@material-ui/core';
import { useSelector } from 'react-redux';

import ProductCard from '../../../components/ProductCard/ProductCard';
import { selectPaginationMeta } from '../../../store/product/productSlice';
import { calculatePaginationStartEndPosition } from '../../../utils/pagination';
import PaginationRanges from '../Pagination/Pagination';

const useStyles = makeStyles(() => ({
  outer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'space-between',
    border: '1px solid #eee',
  },
  productArea: {
    display: 'grid',
    justifyItems: 'space-between',
    alignItems: 'flex-start',
    gridTemplateColumns: 'repeat(auto-fit,minmax(250px, 1fr))',
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

function ProductsGrid({ products }) {
  const classes = useStyles();
  const paginationMeta = useSelector(selectPaginationMeta);

  const { start, end } = calculatePaginationStartEndPosition(paginationMeta?.page, paginationMeta?.perPage);

  return (
    <div className={classes.outer}>
      <div className={classes.productArea}>
        {paginationMeta &&
          products.length > 0 &&
          products.slice(start, end).map(product => <ProductCard key={product.sku} product={product} />)}
      </div>

      {paginationMeta && (
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
