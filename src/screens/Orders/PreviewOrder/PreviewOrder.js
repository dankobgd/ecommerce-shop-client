import React from 'react';

import { Card, CardContent, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import PreviewItem from '../../../components/TableComponents/PreviewItem';
import { useOrder } from '../../../hooks/queries/orderQueries';
import { formatPriceForDisplay } from '../../../utils/priceFormat';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    marginTop: '2rem',
  },
});

function PreviewOrder({ orderId }) {
  const classes = useStyles();
  const { data: order } = useOrder(orderId);

  return (
    <>
      <Container component='main' maxWidth='md'>
        <Card className={classes.root} variant='outlined'>
          <CardContent>
            <PreviewItem title='ID' value={order?.id} />
            <PreviewItem title='Status' value={order?.status} />
            <PreviewItem title='Promo Code' value={order?.promoCode} />
            <PreviewItem title='Subtotal' value={`$${formatPriceForDisplay(order?.subtotal)}`} />
            <PreviewItem title='Total' value={`$${formatPriceForDisplay(order?.total)}`} />
            <PreviewItem title='Shipped At' value={order?.shippedAt} />
            <PreviewItem title='Billing Line 1' value={order?.billingAddressLine1} />
            <PreviewItem title='Billing Line 2' value={order?.billingAddressLine2} />
            <PreviewItem title='Billing City' value={order?.billingAddressCity} />
            <PreviewItem title='Billing Country' value={order?.billingAddressCountry} />
            <PreviewItem title='Billing State' value={order?.billingAddressState} />
            <PreviewItem title='Billing ZIP' value={order?.billingAddressZip} />
            <PreviewItem title='Billing Latitude' value={order?.billingAddressLatitude} />
            <PreviewItem title='Billing Longitude' value={order?.billingAddressLongitude} />
            <PreviewItem title='Shipping Line 1' value={order?.shippingAddressLine1} />
            <PreviewItem title='Shipping Line 2' value={order?.shippingAddressLine2} />
            <PreviewItem title='Shipping City' value={order?.shippingAddressCity} />
            <PreviewItem title='Shipping Country' value={order?.shippingAddressCountry} />
            <PreviewItem title='Shipping State' value={order?.shippingAddressState} />
            <PreviewItem title='Shipping ZIP' value={order?.shippingAddressZip} />
            <PreviewItem title='Shipping Latitude' value={order?.shippingAddressLatitude} />
            <PreviewItem title='Shipping Longitude' value={order?.shippingAddressLongitude} />
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

export default PreviewOrder;
