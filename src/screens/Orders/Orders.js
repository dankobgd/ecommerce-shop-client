import React from 'react';

import { makeStyles } from '@material-ui/styles';

import OrdersTable from './OrdersTable/OrdersTable';
import OrdersToolbar from './OrdersToolbar/OrdersToolbar';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3),
  },
  content: {
    marginTop: theme.spacing(2),
  },
}));

function Orders() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <OrdersToolbar />
      <div className={classes.content}>
        <OrdersTable />
      </div>
    </div>
  );
}

export default Orders;
