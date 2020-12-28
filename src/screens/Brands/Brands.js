import React from 'react';

import { makeStyles } from '@material-ui/styles';

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

  return (
    <div className={classes.root}>
      <BrandsToolbar />
      <div className={classes.content}>
        <BrandsTable />
      </div>
    </div>
  );
}

export default Brands;
