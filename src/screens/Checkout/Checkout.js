import React, { useContext, useEffect, useState } from 'react';

import { yupResolver } from '@hookform/resolvers';
import { Button, Chip, Container, Divider, IconButton, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import DeleteIcon from '@material-ui/icons/Delete';
import RemoveIcon from '@material-ui/icons/Remove';
import { Link, navigate } from '@reach/router';
import { FormProvider, useForm } from 'react-hook-form';
import * as Yup from 'yup';

import CustomTooltip from '../../components/CustomTooltip/CustomTooltip';
import { FormSubmitButton, FormTextField } from '../../components/Form';
import ErrorMessage from '../../components/Message/ErrorMessage';
import {
  addProduct,
  CartContext,
  clearItems,
  clearProduct,
  removeProduct,
  setCartPromoCode,
  setCartPromotion,
  setIsPromoCodeError,
} from '../../components/ShoppingCart/CartContext';
import { usePromotion, usePromotionStatus } from '../../hooks/queries/promotionQueries';
import { useFormServerErrors } from '../../hooks/useFormServerErrors';
import { formatPriceForDisplay, formatPriceUnitSum } from '../../utils/priceFormat';

const useStyles = makeStyles({
  summaryContent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    padding: '2rem 1rem',
    position: 'relative',
  },
  summaryTitle: {
    margin: '1rem 0',
  },
  link: {
    textDecoration: 'none',
  },

  clearCartBtn: {
    marginBottom: '1rem',
    marginLeft: 'auto',
  },
  divider: {
    width: '100%',
    height: '2px',
  },
  summary: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  totalQty: {
    fontSize: '16px',
  },
  subtotalPrice: {
    fontSize: '16px',
  },
  totalPrice: {
    fontSize: '18px',
  },

  // cart list item
  list: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: '1rem',
  },
  listItem: {
    width: '100%',
    borderRadius: '4px',
    padding: '1rem',
    transition: 'all 0.5s',
    '&:hover': {
      backgroundColor: '#f7f7f7',
    },
  },
  listItemContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  imgNameSection: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
  infoSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  listItemImage: {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
  },
  controls: {
    display: 'flex',
    justifyContent: 'center',
  },
  listItemName: {
    fontWeight: 'bold',
    marginLeft: '1rem',
  },
  priceQtySummary: {
    display: 'flex',
  },
  unitPrice: {
    fontSize: '1rem',
  },
  unitQuantity: {
    marginLeft: '10px',
    fontSize: '16px',
  },
  unitSumPrice: {
    color: '#2c365e',
    marginLeft: '10px',
    fontWeight: 600,
    fontSize: '16px',
  },

  promoCodeSummary: {
    display: 'flex',
    width: '100%',
    padding: '1rem 0 2rem 0',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  promoCodeWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  promoCodeTitle: {
    marginLeft: '1rem',
  },
  promoCodeName: {
    marginLeft: '1rem',
  },
  promoCodeValue: {
    marginLeft: '1rem',
  },
});

const schema = Yup.object({
  promoCode: Yup.string(),
});

const formOpts = {
  mode: 'onChange',
  reValidateMode: 'onChange',
  defaultValues: {
    promoCode: '',
  },
  resolver: yupResolver(schema),
};

function Checkout() {
  const classes = useStyles();
  const { cart, dispatch } = useContext(CartContext);
  const [enteredPromoCode, setEnteredPromoCode] = useState('');

  const { isError, error, refetch: fetchStatus, remove: resetQuery } = usePromotionStatus(enteredPromoCode, {
    enabled: false,
    retry: false,
    onSuccess: () => {
      dispatch(setCartPromoCode(enteredPromoCode));
      dispatch(setIsPromoCodeError(false));
    },
    onError: () => {
      dispatch(setCartPromoCode(''));
      dispatch(setCartPromotion(null));
      dispatch(setIsPromoCodeError(true));
    },
  });

  const { refetch: fetchPromotion } = usePromotion(cart.promoCode, {
    enabled: false,
    retry: false,
    onSuccess: result => {
      dispatch(setCartPromotion(result));
      dispatch(setIsPromoCodeError(false));
    },
    onError: () => {
      dispatch(setCartPromotion(null));
      dispatch(setIsPromoCodeError(true));
    },
  });

  const methods = useForm(formOpts);
  const { handleSubmit, setError, reset, watch } = methods;

  const onSubmit = values => {
    setEnteredPromoCode(values.promoCode);
  };

  const handleClearCart = () => {
    dispatch(clearItems());
    dispatch(setCartPromoCode(''));
    dispatch(setIsPromoCodeError(false));
    dispatch(setCartPromotion(null));
  };

  const handleClearPromoCode = () => {
    resetQuery();
    reset({ promoCode: '' });
    dispatch(setCartPromoCode(''));
    dispatch(setIsPromoCodeError(false));
    dispatch(setCartPromotion(null));
    setEnteredPromoCode('');
  };

  useEffect(() => {
    if (cart?.items?.length === 0) {
      navigate('/');
    }
  }, [cart.items.length]);

  useEffect(() => {
    if (cart.promoCode) {
      reset({ promoCode: cart.promoCode });
    }
  }, [cart.promoCode, reset]);

  useEffect(() => {
    if (enteredPromoCode) {
      fetchStatus();
    }
  }, [enteredPromoCode, fetchStatus]);

  useEffect(() => {
    if (cart.promoCode) {
      fetchPromotion();
    }
  }, [cart.promoCode, fetchPromotion]);

  useFormServerErrors(error, setError);

  const watchPromoCode = watch('promoCode');

  return (
    <Container>
      <div className={classes.summaryContent}>
        {cart?.items?.length > 0 && (
          <>
            <Typography variant='h2' component='h2' className={classes.summaryTitle}>
              Order Summary
            </Typography>

            <Divider variant='middle' orientation='horizontal' className={classes.divider} />

            <div className={classes.list}>
              {cart?.items?.map(({ product, quantity }) => (
                <CartListItem key={product.id} product={product} quantity={quantity} />
              ))}
            </div>

            <Button
              size='small'
              color='primary'
              variant='outlined'
              className={classes.clearCartBtn}
              endIcon={<ClearAllIcon />}
              onClick={handleClearCart}
            >
              Clear Cart
            </Button>

            {cart?.promoCode && cart?.promotion && (
              <>
                <Divider
                  variant='middle'
                  orientation='horizontal'
                  className={classes.divider}
                  style={{ marginBottom: '1rem' }}
                />

                <div className={classes.promoCodeSummary}>
                  <div className={classes.promoCodeWrapper}>
                    <Typography
                      component='p'
                      variant='subtitle1'
                      color='textPrimary'
                      className={classes.promoCodeTitle}
                    >
                      Promo Code:
                    </Typography>

                    <Typography
                      component='div'
                      variant='subtitle1'
                      color='textPrimary'
                      className={classes.promoCodeName}
                    >
                      <Chip label={<strong>{cart?.promoCode}</strong>} />
                    </Typography>
                  </div>

                  <div className={classes.promoCodeValue}>
                    {cart?.promotion?.type === 'percentage' ? (
                      <Chip
                        label={<strong> &minus; {cart?.promotion?.amount} %</strong>}
                        style={{ background: 'green', color: '#fff' }}
                      />
                    ) : (
                      <Chip
                        label={<strong> &minus; {formatPriceForDisplay(cart?.promotion?.amount)} $</strong>}
                        style={{ background: 'green', color: '#fff' }}
                      />
                    )}
                  </div>
                </div>
              </>
            )}

            <Divider
              variant='middle'
              orientation='horizontal'
              className={classes.divider}
              style={{ marginBottom: '1rem' }}
            />

            <div className={classes.summary}>
              <Typography component='span' variant='subtitle2' color='textPrimary' className={classes.totalQty}>
                Total Quantity: {cart?.totalQuantity}
              </Typography>
              <Typography component='span' variant='subtitle2' color='textPrimary' className={classes.subtotalPrice}>
                Subtotal: <strong>${formatPriceForDisplay(cart?.subtotalPrice)}</strong>
              </Typography>
              <Typography component='span' variant='subtitle2' color='textPrimary' className={classes.totalPrice}>
                Total Price: <strong>${formatPriceForDisplay(cart?.totalPrice)}</strong>
              </Typography>
            </div>
          </>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <FormProvider {...methods}>
          <form
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <FormTextField name='promoCode' />

              {((cart?.promoCode && cart?.promotion) || (!cart?.promotion && enteredPromoCode)) && (
                <CustomTooltip title={<Typography color='inherit'>Clear Promo Code</Typography>}>
                  <IconButton onClick={handleClearPromoCode}>
                    <ClearIcon />
                  </IconButton>
                </CustomTooltip>
              )}

              <FormSubmitButton disabled={watchPromoCode?.length === 0} style={{ marginLeft: '4px' }}>
                Redeem
              </FormSubmitButton>
            </div>

            {isError && <ErrorMessage message={error.message} />}
          </form>
        </FormProvider>

        <Link to='order' className={classes.link} state={{ prevPath: window.location.pathname }}>
          <Button color='primary' variant='contained'>
            Proceed with checkout
          </Button>
        </Link>
      </div>
    </Container>
  );
}

function CartListItem({ product, quantity }) {
  const classes = useStyles();
  const { dispatch } = useContext(CartContext);

  return (
    <div className={classes.listItem}>
      <div className={classes.listItemContent}>
        <div className={classes.imgNameSection}>
          <Link to={`/${product.id}/${product.slug}`} className={classes.link}>
            <img className={classes.listItemImage} src={product.imageUrl} alt={product.name} />
          </Link>
          <Link to={`/${product.id}/${product.slug}`} className={classes.link}>
            <Typography className={classes.listItemName} component='h3' variant='subtitle1'>
              {product.name}
            </Typography>
          </Link>
        </div>

        <div className={classes.infoSection}>
          <div className={classes.priceQtySummary}>
            <Typography className={classes.unitPrice} component='span' variant='body2'>
              ${formatPriceForDisplay(product.price)}
            </Typography>
            <Typography className={classes.unitQuantity} component='span' variant='body2'>
              x{quantity}
            </Typography>
            <Typography className={classes.unitSumPrice} component='span' variant='body2'>
              ${formatPriceUnitSum(product.price, quantity)}
            </Typography>
          </div>
          <div className={classes.controls}>
            <CustomTooltip title={<Typography color='inherit'>Increase Quantity</Typography>}>
              <IconButton onClick={() => dispatch(addProduct(product))}>
                <AddIcon color='primary' />
              </IconButton>
            </CustomTooltip>
            <CustomTooltip title={<Typography color='inherit'>Decrease Quantity</Typography>}>
              <IconButton onClick={() => dispatch(removeProduct(product.id))}>
                <RemoveIcon style={{ fill: 'orange' }} />
              </IconButton>
            </CustomTooltip>
            <CustomTooltip title={<Typography color='inherit'>Remove Item</Typography>}>
              <IconButton onClick={() => dispatch(clearProduct(product.id))}>
                <DeleteIcon style={{ fill: 'red' }} />
              </IconButton>
            </CustomTooltip>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
