import React, { useContext, useState } from 'react';

import { yupResolver } from '@hookform/resolvers';
import { CircularProgress, Container } from '@material-ui/core';
import { navigate } from '@reach/router';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { FormProvider, useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { FormCheckbox, FormNumberField, FormSelect, FormSubmitButton, FormTextField } from '../../components/Form';
import ErrorMessage from '../../components/Message/ErrorMessage';
import {
  CartContext,
  resetAll,
  setCartPromoCode,
  setCartPromotion,
  setIsPromoCodeError,
} from '../../components/ShoppingCart/CartContext';
import { ToastContext } from '../../components/Toast/ToastContext';
import { useCreateOrder } from '../../hooks/queries/orderQueries';
import { useUserAddresses } from '../../hooks/queries/userQueries';
import { formatPriceForDisplay } from '../../utils/priceFormat';
import StripeTextField from './StripeFields';

const stripePromise = loadStripe('pk_test_UMv9tcoaZfgnFNKYDou3b1gV');

const schema = Yup.object({
  saveAddress: Yup.bool(),
  useExistingBillingAddress: Yup.bool(),
  billingAddressId: Yup.number()
    .positive()
    .nullable()
    .transform((v, o) => (o === '' ? null : v))
    .when('useExistingBillingAddress', {
      is: true,
      then: Yup.number().required(),
    }),
  sameShippingAsBilling: Yup.bool(),
  billingAddress: Yup.object({
    line1: Yup.string()
      .required()
      .when('useExistingBillingAddress', {
        is: val => !val || val === false,
        then: Yup.string().required(),
      }),
    line2: Yup.string(),
    city: Yup.string()
      .required()
      .when('useExistingBillingAddress', {
        is: val => !val || val === false,
        then: Yup.string().required(),
      }),
    country: Yup.string()
      .required()
      .when('useExistingBillingAddress', {
        is: val => !val || val === false,
        then: Yup.string().required(),
      }),
    state: Yup.string(),
    zip: Yup.string(),
    phone: Yup.string(),
  })
    .nullable()
    .default(null),
  shippingAddress: Yup.object({
    line1: Yup.string().when('sameShippingAsBilling', {
      is: val => !val || val === false,
      then: Yup.string().required(),
    }),
    line2: Yup.string(),
    city: Yup.string().when('sameShippingAsBilling', {
      is: val => !val || val === false,
      then: Yup.string().required(),
    }),
    country: Yup.string().when('sameShippingAsBilling', {
      is: val => !val || val === false,
      then: Yup.string().required(),
    }),
    state: Yup.string(),
    zip: Yup.string(),
    phone: Yup.string(),
  })
    .nullable()
    .default(null),
});

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
    billingAddressId: '',
    saveAddress: false,
    sameShippingAsBilling: true,
    useExistingBillingAddress: false,
    billingAddress: { ...addrValues },
    shippingAddress: { ...addrValues },
  },
  resolver: yupResolver(schema),
};

function OrderForm({ location }) {
  const toast = useContext(ToastContext);
  const stripe = useStripe();
  const elements = useElements();
  const methods = useForm(formOpts);
  const { watch } = methods;

  const [stripeError, setStripeError] = useState(null);
  const [stripeComplete, setStripeComplete] = useState(false);

  const { cart, dispatch } = useContext(CartContext);
  const { data: userAddresses } = useUserAddresses();
  const createOrderMutation = useCreateOrder({
    onSuccess: () => {
      dispatch(resetAll());
      setStripeError(null);
      dispatch(setIsPromoCodeError(false));
    },
    onError: () => {
      dispatch(setCartPromoCode(''));
      dispatch(setCartPromotion(null));
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
      setStripeError(error);
    } else {
      const orderPayload = {
        paymentMethodId: paymentMethod.id,
        items: cart.items.map(x => ({ productId: x.product.id, quantity: x.quantity })),
        saveAddress: data.saveAddress,
        useExistingBillingAddress: data.useExistingBillingAddress,
        billingAddressId: data.billingAddressId,
        sameShippingAsBilling: data.sameShippingAsBilling,
      };
      if (cart?.promoCode && cart?.isPromoCodeError === false) {
        orderPayload.promoCode = cart.promoCode;
      }
      if (data.billingAddress) {
        orderPayload.billingAddress = data.billingAddress;
      }
      if (data.shippingAddress) {
        orderPayload.shippingAddress = data.shippingAddress;
      }

      createOrderMutation.mutate(orderPayload);
    }
  };

  const onError = () => {
    toast.error('Form has errors, please check the details');
  };

  const addressOptions = userAddresses?.map(x => ({
    label: `${x.line1}, ${x.line2 && `${x.line2}, `} ${x.city}, ${x.country}`,
    value: x.id,
  }));

  const hasAddresses = userAddresses?.length > 0;

  React.useEffect(() => {
    if (
      cart?.items?.length === 0 &&
      location?.state?.prevPath !== '/checkout' &&
      window.location.pathname !== '/checkout/order'
    ) {
      navigate('/');
    }
  }, [cart.items.length, location]);

  const handleStripeCardOnChange = event => {
    if (event.complete) {
      setStripeError(null);
      setStripeComplete(true);
    } else if (event.error) {
      setStripeError(event.error);
      setStripeComplete(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit, onError)} noValidate>
        {createOrderMutation?.isLoading && <CircularProgress />}
        {createOrderMutation?.isError && <ErrorMessage message={createOrderMutation?.error?.message} />}
        {stripeError && <ErrorMessage message={stripeError?.message} />}

        {hasAddresses && <FormCheckbox name='useExistingBillingAddress' />}

        {!hasAddresses && (
          <>
            <FormTextField name='billingAddress.line1' fullWidth />
            <FormTextField name='billingAddress.line2' fullWidth />
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
              isString
            />
            <FormCheckbox name='saveAddress' label='Save Address Details For Future Checkouts' />
          </>
        )}

        {hasAddresses && !existingBilling && (
          <>
            <FormTextField name='billingAddress.line1' fullWidth />
            <FormTextField name='billingAddress.line2' fullWidth />
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
              isString
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
            <FormTextField name='shippingAddress.country' fullWidth />
            <FormTextField name='shippingAddress.state' fullWidth />
            <FormTextField name='shippingAddress.zip' fullWidth />
            <FormNumberField
              name='shippingAddress.phone'
              fullWidth
              thousandSeparator={false}
              allowLeadingZeros
              format='(###) ###-####'
              mask='_'
              isString
            />
          </>
        )}

        <StripeTextField
          stripeElement={CardElement}
          style={{ marginTop: '10px' }}
          onChange={handleStripeCardOnChange}
        />

        <FormSubmitButton
          color='primary'
          variant='contained'
          type='submit'
          fullWidth
          disabled={!stripe || !stripeComplete}
          style={{ marginTop: '1rem' }}
          loading={createOrderMutation?.isLoading}
        >
          Pay ${formatPriceForDisplay(cart?.totalPrice)}
        </FormSubmitButton>
      </form>
    </FormProvider>
  );
}

function Order({ location }) {
  return (
    <Container component='main' maxWidth='xs'>
      <Elements stripe={stripePromise}>
        <OrderForm location={location} />
      </Elements>
    </Container>
  );
}

export default Order;
