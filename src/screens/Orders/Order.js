import React from 'react';

import { yupResolver } from '@hookform/resolvers';
import { Button, Container } from '@material-ui/core';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

import { FormCheckbox, FormNumberField, FormSelect, FormTextField } from '../../components/Form';
import { selectCartItems, selectCartTotalPrice } from '../../store/cart/cartSlice';
import { orderCreate } from '../../store/order/orderSlice';
import { rules } from '../../utils/validation';
import StripeTextField from './StripeFields';

const stripePromise = loadStripe('pk_test_UMv9tcoaZfgnFNKYDou3b1gV');

const schema = Yup.object({});

const formOpts = {
  mode: 'onChange',
  reValidateMode: 'onChange',
  defaultValues: {
    billingAddress: {
      line1: '',
      line2: '',
      city: '',
      country: '',
      state: '',
      zip: '',
      phone: '',
    },
    shippingAddress: {
      line1: '',
      line2: '',
      city: '',
      country: '',
      state: '',
      zip: '',
      phone: '',
    },
    useExistingBillingAddress: true,
    useExistingShippingAddress: true,
    sameShippingAsBilling: true,
    billingAddressId: '',
    shippingAddressId: '',
  },
  resolver: yupResolver(schema),
};

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const cartTotalPrice = useSelector(selectCartTotalPrice);
  const cartItems = useSelector(selectCartItems);
  const methods = useForm(formOpts);
  const { watch } = methods;

  const shippingAsBilling = watch('sameShippingAsBilling');
  const existingBilling = watch('useExistingBillingAddress');
  // const existingShipping = watch('useExistingShippingAddress');

  const onSubmit = async (data, event) => {
    event.preventDefault();

    console.log(data);

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      console.log(error);
    } else {
      const orderPayload = {
        paymentMethodId: paymentMethod.id,
        items: cartItems.map(x => ({ productId: x.product.id, quantity: x.quantity })),
        billingAddress: data.billingAddress,
        shippingAddress: data.shippingAddress,
        sameShippingAsBilling: data.sameShippingAsBilling,
      };

      await dispatch(orderCreate(orderPayload));
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        <FormCheckbox name='useExistingBillingAddress' />

        {!existingBilling ? (
          <>
            <FormTextField name='billingAddress.line_1' fullWidth />
            <FormTextField name='billingAddress.line_2' fullWidth />
            <FormTextField name='billingAddress.city' fullWidth />
            <FormTextField name='billingAddress.country' fullWidth />
            <FormTextField name='billingAddress.state' fullWidth />
            <FormTextField name='billingAddress.zip' fullWidth />
            <FormNumberField name='billingAddress.phone' fullWidth thousandSeparator={false} />
          </>
        ) : (
          <div>
            <FormSelect
              fullWidth
              name='billingAddressId'
              label='Billing Address'
              options={[
                { label: 'street address 1', value: 1 },
                { label: 'street address 2', value: 2 },
              ]}
            />
          </div>
        )}

        <FormCheckbox name='sameShippingAsBilling' label='use same shipping address as billing address' />

        {!shippingAsBilling && (
          <>
            <FormTextField name='shippingAddress.line1' fullWidth />
            <FormTextField name='shippingAddress.line2' fullWidth />
            <FormTextField name='shippingddress.city' fullWidth />
            <FormTextField name='shippingAddres.country' fullWidth />
            <FormTextField name='shippingAddres.state' fullWidth />
            <FormTextField name='shippingAddress.zip' fullWidth />
            <FormNumberField name='shippingAddress.phone' fullWidth thousandSeparator={false} />
          </>
        )}

        {!existingBilling && !shippingAsBilling && (
          <div>
            <FormSelect
              fullWidth
              name='shippingAddressId'
              label='Shipping Address'
              options={[
                { label: 'street address 1', value: 1 },
                { label: 'street address 2', value: 2 },
              ]}
            />
          </div>
        )}

        <StripeTextField stripeElement={CardElement} style={{ marginTop: '10px' }} />

        <Button
          color='primary'
          variant='contained'
          type='submit'
          fullWidth
          disabled={!stripe}
          style={{ marginTop: '1rem' }}
        >
          Pay ${cartTotalPrice}
        </Button>
      </form>
    </FormProvider>
  );
}

function Order() {
  return (
    <Container component='main' maxWidth='xs'>
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </Container>
  );
}

export default Order;
