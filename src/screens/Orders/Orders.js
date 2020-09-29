import React from 'react';

import { makeStyles } from '@material-ui/styles';
import { useDispatch, useSelector } from 'react-redux';

import { orderGetAll, selectAllOrders } from '../../store/order/orderSlice';
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
  const dispatch = useDispatch();
  const orders = useSelector(selectAllOrders);

  React.useEffect(() => {
    dispatch(orderGetAll());
  }, [dispatch]);

  return (
    <div className={classes.root}>
      <OrdersToolbar />
      <div className={classes.content}>
        <OrdersTable orders={orders} />
      </div>
    </div>
  );
}

export default Orders;
