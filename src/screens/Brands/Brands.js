import React from 'react';

import { makeStyles } from '@material-ui/styles';
import { useQuery, useQueryCache } from 'react-query';

import api from '../../api';
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
  const cache = useQueryCache();

  const info = useQuery('brands', () => api.brands.getAll(), {
    initialData: () => cache.getQueryData(['brands']),
  });

  return (
    <div className={classes.root}>
      <BrandsToolbar />
      <div className={classes.content}>
        <BrandsTable info={info} />
      </div>
    </div>
  );
}

export default Brands;
