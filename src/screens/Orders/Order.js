import React, { useContext } from 'react';

import { yupResolver } from '@hookform/resolvers';
import { Container } from '@material-ui/core';
import { navigate } from '@reach/router';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { FormProvider, useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { FormCheckbox, FormNumberField, FormSelect, FormSubmitButton, FormTextField } from '../../components/Form';
import { CartContext } from '../../components/ShoppingCart/CartContext';
import { useCreateOrder } from '../../hooks/queries/orderQueries';
import { useUserAddresses } from '../../hooks/queries/userQueries';
import { formatPriceForDisplay } from '../../utils/priceFormat';
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
  const methods = useForm(formOpts);
  const { watch } = methods;

  const { items, totalPrice, cartPromoCode, setCartPromoCode, setCartPromotion, resetAll } = useContext(CartContext);
  const { data: userAddresses } = useUserAddresses();
  const createOrderMutation = useCreateOrder({
    onSuccess: () => resetAll(),
    onError: () => {
      setCartPromoCode('');
      setCartPromotion(null);
    },
  });

  const shippingAsBilling = watch('sameShippingAsBilling');
  const existingBilling = watch('useExistingBillingAddress');

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
    } else {
      const orderPayload = {
        paymentMethodId: paymentMethod.id,
        items: items.map(x => ({ productId: x.product.id, quantity: x.quantity })),
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

      createOrderMutation.mutate(orderPayload);
    }
  };

  const addressOptions = userAddresses?.map(x => ({
    label: `${x.line1}, ${x.line2 && `${x.line2}, `} ${x.city}, ${x.country}`,
    value: x.id,
  }));

  const hasAddresses = userAddresses?.length > 0;

  React.useEffect(() => {
    if (items?.length === 0) {
      navigate('/');
    }
  }, [items.length]);

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
            <FormNumberField
              name='billingAddress.phone'
              fullWidth
              thousandSeparator={false}
              allowLeadingZeros
              format='(###) ###-####'
              mask='_'
            />
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
            <FormNumberField
              name='billingAddress.phone'
              fullWidth
              thousandSeparator={false}
              allowLeadingZeros
              format='(###) ###-####'
              mask='_'
            />
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
            <FormNumberField
              name='shippingAddress.phone'
              fullWidth
              thousandSeparator={false}
              allowLeadingZeros
              format='(###) ###-####'
              mask='_'
            />
          </>
        )}

        <StripeTextField stripeElement={CardElement} style={{ marginTop: '10px' }} />

        <FormSubmitButton
          color='primary'
          variant='contained'
          type='submit'
          fullWidth
          disabled={!stripe}
          style={{ marginTop: '1rem' }}
          loading={createOrderMutation?.isLoading}
        >
          Pay ${formatPriceForDisplay(totalPrice)}
        </FormSubmitButton>
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
