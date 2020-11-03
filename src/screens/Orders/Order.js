import React from 'react';

import { yupResolver } from '@hookform/resolvers';
import { Button, Container } from '@material-ui/core';
import { unwrapResult } from '@reduxjs/toolkit';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

import { FormCheckbox, FormNumberField, FormSelect, FormTextField } from '../../components/Form';
import cartSlice, { selectCartItems, selectCartPromoCode, selectCartTotalPrice } from '../../store/cart/cartSlice';
import { orderCreate } from '../../store/order/orderSlice';
import { getAddresses, selectUserAddresses } from '../../store/user/userSlice';
import { rules } from '../../utils/validation';
import StripeTextField from './StripeFields';

const stripePromise = loadStripe('pk_test_UMv9tcoaZfgnFNKYDou3b1gV');

const schema = Yup.object({});

const addrValues = {
  line1: '',
  line2: '',
  city: '',
  country: '',
  state: '',
  zip: '',
  phone: '',
};

const formOpts = {
  mode: 'onChange',
  reValidateMode: 'onChange',
  defaultValues: {
    billingAddress: {
      ...addrValues,
    },
    shippingAddress: {
      ...addrValues,
    },
    saveAddress: false,
    useExistingBillingAddress: false,
    billingAddressId: '',
    sameShippingAsBilling: true,
  },
  resolver: yupResolver(schema),
};

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const cartTotalPrice = useSelector(selectCartTotalPrice);
  const cartItems = useSelector(selectCartItems);
  const addresses = useSelector(selectUserAddresses);
  const cartPromoCode = useSelector(selectCartPromoCode);
  const methods = useForm(formOpts);
  const { watch } = methods;

  const shippingAsBilling = watch('sameShippingAsBilling');
  const existingBilling = watch('useExistingBillingAddress');

  React.useEffect(() => {
    dispatch(getAddresses());
  }, [dispatch]);

  const onSubmit = async (data, event) => {
    event.preventDefault();

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
      dispatch(cartSlice.actions.setCartPromoCode(null));
    } else {
      const orderPayload = {
        paymentMethodId: paymentMethod.id,
        items: cartItems.map(x => ({ productId: x.product.id, quantity: x.quantity })),
        billingAddress: data.billingAddress,
        shippingAddress: data.shippingAddress,
        saveAddress: data.saveAddress,
        useExistingBillingAddress: data.useExistingBillingAddress,
        billingAddressId: data.billingAddressId,
        sameShippingAsBilling: data.sameShippingAsBilling,
      };
      if (cartPromoCode) {
        orderPayload.promoCode = cartPromoCode;
      }

      try {
        const result = await dispatch(orderCreate(orderPayload));
        unwrapResult(result);
      } catch (error) {
        console.log(error);
      } finally {
        dispatch(cartSlice.actions.setCartPromoCode(null));
        dispatch(cartSlice.actions.setCartPromoCodeError(false));
      }
    }
  };

  const addressOptions = addresses.map(x => ({
    label: `${x.line1}, ${x.line2 && `${x.line2}, `} ${x.city}, ${x.country}`,
    value: x.id,
  }));

  const hasAddresses = addresses.length > 0;

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        {hasAddresses && <FormCheckbox name='useExistingBillingAddress' />}

        {!hasAddresses && (
          <>
            <FormTextField name='billingAddress.line_1' fullWidth />
            <FormTextField name='billingAddress.line_2' fullWidth />
            <FormTextField name='billingAddress.city' fullWidth />
            <FormTextField name='billingAddress.country' fullWidth />
            <FormTextField name='billingAddress.state' fullWidth />
            <FormTextField name='billingAddress.zip' fullWidth />
            <FormNumberField name='billingAddress.phone' fullWidth thousandSeparator={false} />
            <FormCheckbox name='saveAddress' label='Save Address Details For Future Checkouts' />
          </>
        )}

        {hasAddresses && !existingBilling && (
          <>
            <FormTextField name='billingAddress.line_1' fullWidth />
            <FormTextField name='billingAddress.line_2' fullWidth />
            <FormTextField name='billingAddress.city' fullWidth />
            <FormTextField name='billingAddress.country' fullWidth />
            <FormTextField name='billingAddress.state' fullWidth />
            <FormTextField name='billingAddress.zip' fullWidth />
            <FormNumberField name='billingAddress.phone' fullWidth thousandSeparator={false} />
          </>
        )}

        {hasAddresses && existingBilling && (
          <div>
            <FormSelect fullWidth name='billingAddressId' label='Billing Address' options={addressOptions} />
          </div>
        )}

        <FormCheckbox name='sameShippingAsBilling' label='use same shipping address as billing address' />

        {!shippingAsBilling && (
          <>
            <FormTextField name='shippingAddress.line1' fullWidth />
            <FormTextField name='shippingAddress.line2' fullWidth />
            <FormTextField name='shippingAddress.city' fullWidth />
            <FormTextField name='shippingAddres.country' fullWidth />
            <FormTextField name='shippingAddres.state' fullWidth />
            <FormTextField name='shippingAddress.zip' fullWidth />
            <FormNumberField name='shippingAddress.phone' fullWidth thousandSeparator={false} />
          </>
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
