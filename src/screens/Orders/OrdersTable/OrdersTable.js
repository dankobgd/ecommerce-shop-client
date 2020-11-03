import React, { useState } from 'react';

import {
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { makeStyles } from '@material-ui/styles';
import { Link } from '@reach/router';
import clsx from 'clsx';
import { nanoid } from 'nanoid';
import { useDispatch, useSelector } from 'react-redux';

import orderSlice, { orderGetAll, orderGetAllForUser, selectPaginationMeta } from '../../../store/order/orderSlice';
import { selectUserProfile } from '../../../store/user/userSlice';
import { calculatePaginationStartEndPosition } from '../../../utils/pagination';
import { formatPriceForDisplay } from '../../../utils/priceFormat';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0,
  },
  inner: {
    minWidth: 1050,
    overflowX: 'auto',
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  avatar: {
    marginRight: theme.spacing(2),
  },
  actions: {
    justifyContent: 'flex-end',
  },
}));

const OrdersTable = props => {
  const { className, orders, ...rest } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector(selectUserProfile);
  const paginationMeta = useSelector(selectPaginationMeta);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleSelectAll = event => {
    let selected;

    if (event.target.checked) {
      selected = orders.map(order => order.id);
    } else {
      selected = [];
    }

    setSelectedOrders(selected);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedOrders.indexOf(id);
    let newSelectedOrders = [];

    if (selectedIndex === -1) {
      newSelectedOrders = newSelectedOrders.concat(selectedOrders, id);
    } else if (selectedIndex === 0) {
      newSelectedOrders = newSelectedOrders.concat(selectedOrders.slice(1));
    } else if (selectedIndex === selectedOrders.length - 1) {
      newSelectedOrders = newSelectedOrders.concat(selectedOrders.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedOrders = newSelectedOrders.concat(
        selectedOrders.slice(0, selectedIndex),
        selectedOrders.slice(selectedIndex + 1)
      );
    }

    setSelectedOrders(newSelectedOrders);
  };

  const handlePageChange = (e, page) => {
    const params = new URLSearchParams({ per_page: paginationMeta.perPage, page: page + 1 });
    if (user.role === 'admin') {
      dispatch(orderGetAll(params));
    } else {
      dispatch(orderGetAllForUser({ id: user.id, params }));
    }
  };

  const handleRowsPerPageChange = e => {
    const params = new URLSearchParams({ per_page: e.target.value });
    if (user.role === 'admin') {
      dispatch(orderGetAll(params));
    } else {
      dispatch(orderGetAllForUser({ id: user.id, params }));
    }
  };

  const { start, end } = calculatePaginationStartEndPosition(paginationMeta?.page, paginationMeta?.perPage);

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardContent className={classes.content}>
        <div className={classes.inner}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding='checkbox'>
                  <Checkbox
                    checked={selectedOrders.length === orders.length}
                    color='primary'
                    indeterminate={selectedOrders.length > 0 && selectedOrders.length < orders.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Subtotal</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>ShippedAt</TableCell>
                <TableCell>Billing Line1 </TableCell>
                <TableCell>Billing Line2 </TableCell>
                <TableCell>Billing City </TableCell>
                <TableCell>Billing Country </TableCell>
                <TableCell>Billing State </TableCell>
                <TableCell>Billing ZIP </TableCell>
                <TableCell>Billing Latitude </TableCell>
                <TableCell>Billing Longitude</TableCell>
                <TableCell>Shipping Line1 </TableCell>
                <TableCell>Shipping Line2 </TableCell>
                <TableCell>Shipping City </TableCell>
                <TableCell>Shipping Country </TableCell>
                <TableCell>Shipping State </TableCell>
                <TableCell>Shipping ZIP </TableCell>
                <TableCell>Shipping Latitude </TableCell>
                <TableCell>Shipping Longitude</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {paginationMeta &&
                orders.length > 0 &&
                orders.slice(start, end).map(order => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={nanoid()}
                    selected={selectedOrders.indexOf(order.id) !== -1}
                  >
                    <TableCell padding='checkbox'>
                      <Checkbox
                        checked={selectedOrders.indexOf(order.id) !== -1}
                        color='primary'
                        onChange={event => handleSelectOne(event, order.id)}
                        value='true'
                      />
                    </TableCell>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>${formatPriceForDisplay(order.subtotal)}</TableCell>
                    <TableCell>${formatPriceForDisplay(order.total)}</TableCell>
                    <TableCell>{order.shippedAt}</TableCell>
                    <TableCell>{order.billingAddressLine1}</TableCell>
                    <TableCell>{order.billingAddressLine2}</TableCell>
                    <TableCell>{order.billingAddressCity}</TableCell>
                    <TableCell>{order.billingAddressCountry}</TableCell>
                    <TableCell>{order.billingAddressState}</TableCell>
                    <TableCell>{order.billingAddressZip}</TableCell>
                    <TableCell>{order.billingAddressLatitude}</TableCell>
                    <TableCell>{order.billingAddressLongitude}</TableCell>
                    <TableCell>{order.shippingAddressLine1}</TableCell>
                    <TableCell>{order.shippingAddressLine2}</TableCell>
                    <TableCell>{order.shippingAddressCity}</TableCell>
                    <TableCell>{order.shippingAddressCountry}</TableCell>
                    <TableCell>{order.shippingAddressState}</TableCell>
                    <TableCell>{order.shippingAddressZip}</TableCell>
                    <TableCell>{order.shippingAddressLatitude}</TableCell>
                    <TableCell>{order.shippingAddressLongitude}</TableCell>
                    <TableCell>
                      <Link to={`${order.id}/${order.slug}/edit`} style={{ textDecoration: 'none' }}>
                        <Button
                          variant='outlined'
                          color='secondary'
                          startIcon={<EditIcon />}
                          onClick={() => dispatch(orderSlice.actions.setEditId(order.id))}
                        >
                          Edit
                        </Button>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant='outlined'
                        color='secondary'
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDialogOpen()}
                      >
                        Delete
                      </Button>
                      <Dialog
                        open={dialogOpen}
                        onClose={handleDialogClose}
                        aria-labelledby='delete order dialog'
                        aria-describedby='deletes the order'
                      >
                        <DialogTitle id='delete order dialog'>Delete Order?</DialogTitle>
                        <DialogContent>
                          <DialogContentText>
                            Are you sure you want to delete the order <strong>{order.name}</strong> ?
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleDialogClose} color='primary'>
                            Cancel
                          </Button>
                          <Button
                            onClick={() => {
                              handleDialogClose();
                              dispatch(order(order.id));
                            }}
                            color='primary'
                            autoFocus
                          >
                            Delete
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardActions className={classes.actions}>
        {paginationMeta && (
          <TablePagination
            component='div'
            count={paginationMeta.totalCount || -1}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handleRowsPerPageChange}
            page={paginationMeta.page - 1 || 0}
            rowsPerPage={paginationMeta.perPage || 50}
            rowsPerPageOptions={[10, 25, 50, 75, 120]}
          />
        )}
      </CardActions>
    </Card>
  );
};

export default OrdersTable;
