import React from 'react';

import { yupResolver } from '@hookform/resolvers';
import { Button, Container } from '@material-ui/core';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { FormProvider, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';

import { FormCheckbox, FormNumberField, FormSelect, FormTextField } from '../../components/Form';
import { selectCartItems, selectCartTotalPrice } from '../../store/cart/cartSlice';
import { rules } from '../../utils/validation';
import StripeTextField from './StripeFields';

const stripePromise = loadStripe('pk_test_UMv9tcoaZfgnFNKYDou3b1gV');

const schema = Yup.object({});

const formOpts = {
  mode: 'onChange',
  reValidateMode: 'onChange',
  defaultValues: {
    billing_address: {
      line1: '',
      line2: '',
      city: '',
      country: '',
      state: '',
      zip: '',
      phone: '',
    },
    shipping_address: {
      line1: '',
      line2: '',
      city: '',
      country: '',
      state: '',
      zip: '',
      phone: '',
    },
    use_existing_billing_address: true,
    use_existing_shipping_address: true,
    same_shipping_as_billing: true,
    billing_address_id: '',
    shipping_address_id: '',
  },
  resolver: yupResolver(schema),
};

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const cartTotalPrice = useSelector(selectCartTotalPrice);
  const cartItems = useSelector(selectCartItems);
  const methods = useForm(formOpts);
  const { watch } = methods;

  const shippingAsBilling = watch('same_shipping_as_billing');
  const existingBilling = watch('use_existing_billing_address');
  // const existingShipping = watch('use_existing_shipping_address');

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
      console.log(paymentMethod);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        <FormCheckbox name='use_existing_billing_address' />

        {!existingBilling ? (
          <>
            <FormTextField name='shipping_address.line1' fullWidth />
            <FormTextField name='shipping_address.line2' fullWidth />
            <FormTextField name='shipping_address.city' fullWidth />
            <FormTextField name='shipping_line_1' fullWidth />
            <FormTextField name='shipping_line_2' fullWidth />
            <FormTextField name='shipping_city' fullWidth />
            <FormTextField name='shipping_country' fullWidth />
            <FormTextField name='shipping_state' fullWidth />
            <FormTextField name='shipping_zip' fullWidth />
            <FormNumberField name='shipping_phone' fullWidth thousandSeparator={false} />
          </>
        ) : (
          <div>
            <FormSelect
              fullWidth
              name='billing_address_id'
              label='Billing Address'
              options={[
                { label: 'street address 1', value: 1 },
                { label: 'street address 2', value: 2 },
              ]}
            />
          </div>
        )}

        <FormCheckbox name='same_shipping_as_billing' label='use same shipping address as billing address' />

        {!shippingAsBilling && (
          <>
            <FormTextField name='billing_line_1' fullWidth />
            <FormTextField name='billing_line_2' fullWidth />
            <FormTextField name='billing_city' fullWidth />
            <FormTextField name='billing_country' fullWidth />
            <FormTextField name='billing_state' fullWidth />
            <FormTextField name='billing_zip' fullWidth />
            <FormNumberField name='billing_phone' fullWidth thousandSeparator={false} />
          </>
        )}

        {!existingBilling && !shippingAsBilling && (
          <div>
            <FormSelect
              fullWidth
              name='shipping_address_id'
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
