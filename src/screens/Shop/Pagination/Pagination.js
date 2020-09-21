import React from 'react';

import { makeStyles } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { useDispatch } from 'react-redux';

import { productGetFeatured } from '../../../store/product/productSlice';

const useStyles = makeStyles(() => ({
  paginationOuter: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
  perPage: {
    display: 'block',
  },
  pagination: {
    marginLeft: 'auto',
  },
}));

function PaginationRanges({ page, perPage, pageCount }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const perPageSizes = [10, 25, 50, 75, 120];

  const [pageData, setPageData] = React.useState({
    numPage: page,
    numPerPage: perPage,
    numPageCount: pageCount,
  });

  const handlePageChange = (e, value) => {
    setPageData(s => ({ ...s, numPerPage: perPage, numPage: value }));
    const params = new URLSearchParams({ per_page: perPage, page: value });
    dispatch(productGetFeatured(params));
  };

  const handleRowsPerPageChange = e => {
    setPageData(s => ({ ...s, numPerPage: e.target.value, numPage: 1 }));
    const params = new URLSearchParams({ per_page: e.target.value });
    dispatch(productGetFeatured(params));
  };

  return (
    <div className={classes.paginationOuter}>
      <div className={classes.perPage}>
        <span style={{ marginRight: '4px' }}>per page</span>
        {/* eslint-disable-next-line jsx-a11y/no-onchange */}
        <select onChange={handleRowsPerPageChange} value={pageData.numPerPage}>
          {perPageSizes.map(size => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <div className={classes.pagination}>
        <Pagination
          color='primary'
          shape='rounded'
          size='large'
          count={pageData.numPageCount}
          page={pageData.numPage}
          siblingCount={1}
          boundaryCount={2}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
}

export default PaginationRanges;
