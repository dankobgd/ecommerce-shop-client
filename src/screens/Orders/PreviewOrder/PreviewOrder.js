import React from 'react';

import { Box, Card, CardContent, Container, Tab, Tabs } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import PreviewItem from '../../../components/TableComponents/PreviewItem';
import { useOrder, useOrderDetails } from '../../../hooks/queries/orderQueries';
import { formatDate } from '../../../utils/formatDate';
import { formatPriceForDisplay } from '../../../utils/priceFormat';
import OrderDetailsTable from './OrderDetailsTable';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    marginTop: '2rem',
  },
});

const a11yProps = index => ({
  id: `preview-order-tab-${index}`,
  'aria-controls': `preview-order-tabpanel-${index}`,
});

function PreviewOrder({ orderId }) {
  const classes = useStyles();
  const { data: order } = useOrder(orderId);
  const { data: orderDetails } = useOrderDetails(orderId);

  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Container component='main' maxWidth='md'>
        <Card className={classes.root} variant='outlined'>
          <div>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label='product view and relations tabs'
              variant='fullWidth'
            >
              <Tab label='Order' {...a11yProps(0)} />
              <Tab label='Details' {...a11yProps(1)} />
            </Tabs>
          </div>
          <CardContent>
            <TabPanel value={value} index={0}>
              <PreviewItem title='ID' value={order?.id} />
              <PreviewItem title='Status' value={order?.status} />
              <PreviewItem title='Promo Code' value={order?.promoCode} />
              <PreviewItem title='Promo Code Type' value={order?.promoCodeType} />
              <PreviewItem
                title='Promo Code Amount'
                value={
                  order?.promoCodeType === 'percentage'
                    ? `${order?.promoCodeAmount}%`
                    : `$${formatPriceForDisplay(order?.promoCodeAmount)}`
                }
              />
              <PreviewItem title='Subtotal' value={`$${formatPriceForDisplay(order?.subtotal)}`} />
              <PreviewItem title='Total' value={`$${formatPriceForDisplay(order?.total)}`} />
              <PreviewItem title='Ordered At' value={formatDate(order?.createdAt)} />
              <PreviewItem title='Payment Method ID' value={order?.paymentMethodId} />
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
              <PreviewItem title='Shipped At' value={order?.shippedAt} />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <OrderDetailsTable details={orderDetails} order={order} />
            </TabPanel>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

export default PreviewOrder;
