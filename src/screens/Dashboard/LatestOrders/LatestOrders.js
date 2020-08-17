import React from 'react';

import {
  Card,
  CardActions,
  CardHeader,
  CardContent,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  TableSortLabel,
} from '@material-ui/core';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';

import StatusBullet from '../../../components/StatusBullet/StatusBullet';
import mockData from './data';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0,
  },
  inner: {
    minWidth: 800,
  },
  statusContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  status: {
    marginRight: theme.spacing(1),
  },
  actions: {
    justifyContent: 'flex-end',
  },
}));

const statusColors = {
  delivered: 'success',
  pending: 'info',
  refunded: 'danger',
};

const LatestOrders = props => {
  const { className, ...rest } = props;
  const classes = useStyles();

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardHeader
        action={
          <Button color='primary' size='small' variant='outlined'>
            New entry
          </Button>
        }
        title='Latest Orders'
      />
      <Divider />
      <CardContent className={classes.content}>
        <div className={classes.inner}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order Ref</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell sortDirection='desc'>
                  <Tooltip enterDelay={300} title='Sort'>
                    <TableSortLabel active direction='desc'>
                      Date
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockData.map(order => (
                <TableRow hover key={order.id}>
                  <TableCell>{order.ref}</TableCell>
                  <TableCell>{order.customer.name}</TableCell>
                  <TableCell>{new Date().toUTCString()}</TableCell>
                  <TableCell>
                    <div className={classes.statusContainer}>
                      <StatusBullet className={classes.status} color={statusColors[order.status]} size='sm' />
                      {order.status}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <Divider />
      <CardActions className={classes.actions}>
        <Button color='primary' size='small' variant='text'>
          View all <ArrowRightIcon />
        </Button>
      </CardActions>
    </Card>
  );
};

export default LatestOrders;
