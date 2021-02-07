import React from 'react';

import {
  Button,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import ReceiptIcon from '@material-ui/icons/Receipt';
import { makeStyles } from '@material-ui/styles';
import { nanoid } from 'nanoid';

import { baseURL } from '../../../api/apiClient';
import { formatDate } from '../../../utils/formatDate';
import { formatPriceForDisplay, formatPriceUnitSum } from '../../../utils/priceFormat';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0,
  },
  inner: {
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

  promoCodeSummary: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    marginTop: '1rem',
  },
  promoCodeWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  promoCodeName: {
    marginLeft: '1rem',
  },
  promoCodeValue: {
    marginLeft: '1rem',
  },
}));

const OrderDetailsTable = ({ details, order }) => {
  const classes = useStyles();

  return (
    <div>
      <Card className={classes.root}>
        <CardContent className={classes.content}>
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Image</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Summed Price</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {details?.map(detail => (
                  <TableRow className={classes.tableRow} hover key={nanoid()}>
                    <TableCell>{detail?.id}</TableCell>
                    <TableCell>
                      <img src={detail?.imageUrl} alt='order item' width={60} height={60} />
                    </TableCell>
                    <TableCell>{detail?.name}</TableCell>
                    <TableCell>
                      <Chip
                        label={`$${formatPriceForDisplay(detail?.historyPrice)}`}
                        style={{ color: '#fff', backgroundColor: 'green' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip label={`x${detail?.quantity}`} />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`$${formatPriceUnitSum(detail?.historyPrice, detail?.quantity)}`}
                        style={{ color: '#fff', backgroundColor: 'green' }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div style={{ marginTop: '2rem' }}>
        <Typography component='h3' variant='subtitle2' color='textPrimary'>
          Payment ID: {order?.paymentMethodId}
        </Typography>

        <Typography component='h3' variant='subtitle2' color='textPrimary' style={{ marginTop: '1rem' }}>
          Ordered Date: {formatDate(order?.createdAt)}
        </Typography>
      </div>

      <div>
        {order?.promoCode && (
          <div className={classes.promoCodeSummary}>
            <div className={classes.promoCodeWrapper}>
              <Typography component='p' variant='subtitle1' color='textPrimary' className={classes.promoCodeTitle}>
                Promo Code:
              </Typography>

              <Typography component='div' variant='subtitle1' color='textPrimary' className={classes.promoCodeName}>
                <Chip label={order?.promoCode} />
              </Typography>
            </div>

            <div className={classes.promoCodeValue}>
              {order?.promoCodeType === 'percentage' ? (
                <Chip label={<> &minus; {order?.promoCodeAmount} %</>} style={{ background: 'green', color: '#fff' }} />
              ) : (
                <Chip
                  label={<> &minus; {formatPriceForDisplay(order?.promoCodeAmount)} $</>}
                  style={{ background: 'green', color: '#fff' }}
                />
              )}
            </div>
          </div>
        )}

        <div>
          <Typography component='h3' variant='subtitle1' color='textPrimary' style={{ marginTop: '1rem' }}>
            Subtotal Price: ${formatPriceForDisplay(order?.subtotal)}
          </Typography>

          <Typography component='h3' variant='subtitle1' color='textPrimary' style={{ marginTop: '1rem' }}>
            Total Charge: <strong>${formatPriceForDisplay(order?.total)}</strong>
          </Typography>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <a href={order.receiptUrl} target='_blank' rel='noopener noreferrer' style={{ textDecoration: 'none' }}>
            <Button startIcon={<ReceiptIcon />} variant='contained' color='primary'>
              View Receipt
            </Button>
          </a>

          <a
            href={`${baseURL}v1/orders/${order.id}/details/pdf`}
            target='_blank'
            rel='noopener noreferrer'
            style={{ textDecoration: 'none', marginLeft: '1rem' }}
          >
            <Button startIcon={<PictureAsPdfIcon />} variant='contained' color='primary'>
              Download Invoice PDF
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsTable;
