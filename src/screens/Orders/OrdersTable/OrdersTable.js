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
  Chip,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { nanoid } from 'nanoid';

import { PreviewButton } from '../../../components/TableComponents/TableButtons';
import { useOrders } from '../../../hooks/queries/orderQueries';
import { useUserFromCache, useUserOrders } from '../../../hooks/queries/userQueries';
import { diff } from '../../../utils/diff';
import { formatDate } from '../../../utils/formatDate';
import { getPersistedPagination, paginationRanges, persistPagination } from '../../../utils/pagination';
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

const OrdersTable = ({ className, ...rest }) => {
  const classes = useStyles();
  const user = useUserFromCache();

  const [pageMeta, setPageMeta] = useState(getPersistedPagination('orders'));
  const { data: allOrders } = useOrders(pageMeta, {
    keepPreviousData: true,
    enabled: user?.role === 'admin',
  });
  const { data: userOrders } = useUserOrders(user?.id, pageMeta, {
    keepPreviousData: true,
    enabled: user?.role === 'user',
  });

  const orders = user?.role === 'admin' ? allOrders : userOrders;

  const [selectedData, setSelectedData] = useState([]);

  const handleSelectAll = event => {
    const selected = event.target.checked ? orders?.data?.map(x => x.id) : [];
    setSelectedData(selected);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedData.indexOf(id);
    let newSelectedData = [];

    if (selectedIndex === -1) {
      newSelectedData = newSelectedData.concat(selectedData, id);
    } else if (selectedIndex === 0) {
      newSelectedData = newSelectedData.concat(selectedData.slice(1));
    } else if (selectedIndex === selectedData.length - 1) {
      newSelectedData = newSelectedData.concat(selectedData.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedData = newSelectedData.concat(
        selectedData.slice(0, selectedIndex),
        selectedData.slice(selectedIndex + 1)
      );
    }

    setSelectedData(newSelectedData);
  };

  const handlePageChange = (e, page) => {
    const params = { page: page + 1, per_page: orders?.meta?.perPage };
    if (Object.keys(diff(pageMeta, params).length > 0)) {
      setPageMeta(meta => ({ ...meta, ...params }));
    }
  };

  const handleRowsPerPageChange = e => {
    const params = { page: 1, per_page: e.target.value };
    if (Object.keys(diff(pageMeta, params).length > 0)) {
      setPageMeta(meta => ({ ...meta, ...params }));
    }
  };

  React.useEffect(() => {
    persistPagination('orders', pageMeta);
  }, [pageMeta]);

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardContent className={classes.content}>
        <div className={classes.inner}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding='checkbox'>
                  <Checkbox
                    checked={selectedData?.length === orders?.data?.length}
                    color='primary'
                    indeterminate={selectedData?.length > 0 && selectedData?.length < orders?.data?.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Subtotal</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Promo Code</TableCell>
                <TableCell>Promo Code Type</TableCell>
                <TableCell>Promo Code Amount</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Shipped At</TableCell>
                <TableCell>Payment Method ID</TableCell>
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
              {orders?.data?.map(order => (
                <TableRow
                  className={classes.tableRow}
                  hover
                  key={nanoid()}
                  selected={selectedData.indexOf(order.id) !== -1}
                >
                  <TableCell padding='checkbox'>
                    <Checkbox
                      checked={selectedData.indexOf(order.id) !== -1}
                      color='primary'
                      onChange={event => handleSelectOne(event, order.id)}
                      value='true'
                    />
                  </TableCell>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>
                    <Chip
                      label={order.status}
                      color={order.status === 'success' ? 'primary' : undefined}
                      style={{ color: '#fff', backgroundColor: order.status !== 'success' && 'darkred' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={`$${formatPriceForDisplay(order.subtotal)}`}
                      style={{ color: '#fff', backgroundColor: 'green' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={`$${formatPriceForDisplay(order.total)}`}
                      style={{ color: '#fff', backgroundColor: 'green' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip label={order.promoCode} />
                  </TableCell>
                  <TableCell>
                    <Chip label={order.promoCodeType} />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={
                        order?.promoCodeType === 'percentage'
                          ? `${order.promoCodeAmount}%`
                          : `${formatPriceForDisplay(order.promoCodeAmount)}$`
                      }
                      style={{ color: '#fff', backgroundColor: 'goldenrod' }}
                    />
                  </TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell>{formatDate(order.shippedAt)}</TableCell>
                  <TableCell>{order.paymentMethodId}</TableCell>
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
                    <PreviewButton to={`${order.id}/preview`} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardActions className={classes.actions}>
        {orders?.meta && (
          <TablePagination
            component='div'
            count={orders?.meta?.totalCount || -1}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handleRowsPerPageChange}
            page={pageMeta.page - 1}
            rowsPerPage={pageMeta?.per_page}
            rowsPerPageOptions={paginationRanges}
          />
        )}
      </CardActions>
    </Card>
  );
};

export default OrdersTable;
