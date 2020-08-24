import React from 'react';

import { makeStyles } from '@material-ui/styles';
import { useDispatch, useSelector } from 'react-redux';

import { brandGetAll, selectAllBrands } from '../../store/brand/brandSlice';
import BrandsTable from './BrandsTable/BrandsTable';
import BrandsToolbar from './BrandsToolbar/BrandsToolbar';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3),
  },
  content: {
    marginTop: theme.spacing(2),
  },
}));

function Brands() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const brands = useSelector(selectAllBrands);

  React.useEffect(() => {
    dispatch(brandGetAll());
  }, [dispatch]);

  return (
    <div className={classes.root}>
      <BrandsToolbar />
      <div className={classes.content}>
        <BrandsTable brands={brands} />
      </div>
    </div>
  );
}

export default Brands;
