import React, { useContext, useEffect, useState } from 'react';

import { yupResolver } from '@hookform/resolvers';
import { Button, Chip, Container, Divider, IconButton, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import DeleteIcon from '@material-ui/icons/Delete';
import RemoveIcon from '@material-ui/icons/Remove';
import { Link, navigate } from '@reach/router';
import { FormProvider, useForm } from 'react-hook-form';
import * as Yup from 'yup';

import CustomTooltip from '../../components/CustomTooltip/CustomTooltip';
import { FormSubmitButton, FormTextField } from '../../components/Form';
import ErrorMessage from '../../components/Message/ErrorMessage';
import { CartContext } from '../../components/ShoppingCart/CartContext';
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
});

const schema = Yup.object({
  promoCode: Yup.string().required(),
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
  const {
    subtotalPrice,
    totalPrice,
    totalQuantity,
    items,
    clearItems,
    cartPromoCode,
    setCartPromoCode,
    cartPromotion,
    setCartPromotion,
  } = useContext(CartContext);
  const [enteredPromoCode, setEnteredPromoCode] = useState('');

  const { isError, error, refetch: fetchStatus } = usePromotionStatus(enteredPromoCode, {
    enabled: false,
    retry: false,
    onSuccess: () => setCartPromoCode(enteredPromoCode),
    onError: () => {
      setCartPromoCode('');
      setCartPromotion(null);
    },
  });

  const { refetch: fetchPromotion } = usePromotion(cartPromoCode, {
    enabled: false,
    retry: false,
    onSuccess: result => setCartPromotion(result),
    onError: () => setCartPromotion(null),
  });

  const methods = useForm(formOpts);
  const { handleSubmit, setError, reset } = methods;

  const onSubmit = values => {
    setEnteredPromoCode(values.promoCode);
  };

  useEffect(() => {
    if (items?.length === 0) {
      navigate('/');
    }
  }, [items.length]);

  useEffect(() => {
    if (cartPromoCode) {
      reset({ promoCode: cartPromoCode });
    }
  }, [cartPromoCode, reset]);

  useEffect(() => {
    if (enteredPromoCode) {
      fetchStatus();
    }
  }, [enteredPromoCode, fetchStatus]);

  useEffect(() => {
    if (cartPromoCode) {
      fetchPromotion();
    }
  }, [cartPromoCode, fetchPromotion]);

  useFormServerErrors(error, setError);

  return (
    <Container>
      <div className={classes.summaryContent}>
        {items?.length > 0 && (
          <>
            <Typography variant='h2' component='h2' className={classes.summaryTitle}>
              Order Summary
            </Typography>

            <Divider variant='middle' orientation='horizontal' className={classes.divider} />

            <div className={classes.list}>
              {items.map(({ product, quantity }) => (
                <CartListItem key={product.id} product={product} quantity={quantity} />
              ))}
            </div>

            <Button
              size='small'
              color='primary'
              variant='outlined'
              className={classes.clearCartBtn}
              endIcon={<ClearAllIcon />}
              onClick={() => {
                clearItems();
                setCartPromoCode('');
                setCartPromotion(null);
              }}
            >
              Clear Cart
            </Button>

            {cartPromoCode && cartPromotion && (
              <>
                <Divider
                  variant='middle'
                  orientation='horizontal'
                  className={classes.divider}
                  style={{ marginBottom: '1rem' }}
                />

                <div className={classes.promoCodeSummary}>
                  <Typography component='span' variant='subtitle2' color='textPrimary' className={classes.promoCode}>
                    Promo Code: {cartPromoCode}
                  </Typography>
                  <Chip label={`-${cartPromotion.amount}${cartPromotion.type === 'percentage' ? '%' : '$'}`} />
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
                Total Quantity: {totalQuantity}
              </Typography>
              <Typography component='span' variant='subtitle2' color='textPrimary' className={classes.subtotalPrice}>
                Subtotal: <strong>${formatPriceForDisplay(subtotalPrice)}</strong>
              </Typography>
              <Typography component='span' variant='subtitle2' color='textPrimary' className={classes.totalPrice}>
                Total Price: <strong>${formatPriceForDisplay(totalPrice)}</strong>
              </Typography>
            </div>
          </>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <FormProvider {...methods}>
          <form
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            {isError && <ErrorMessage message={error.message} />}
            <FormTextField name='promoCode' />
            <FormSubmitButton style={{ marginLeft: '4px' }}>Redeem</FormSubmitButton>
          </form>
        </FormProvider>

        <Link to='order' className={classes.link}>
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
  const { addProduct, removeProduct, clearProduct } = useContext(CartContext);

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
              <IconButton onClick={() => addProduct(product)}>
                <AddIcon />
              </IconButton>
            </CustomTooltip>
            <CustomTooltip title={<Typography color='inherit'>Decrease Quantity</Typography>}>
              <IconButton onClick={() => removeProduct(product.id)}>
                <RemoveIcon />
              </IconButton>
            </CustomTooltip>
            <CustomTooltip title={<Typography color='inherit'>Remove Item</Typography>}>
              <IconButton onClick={() => clearProduct(product.id)}>
                <DeleteIcon />
              </IconButton>
            </CustomTooltip>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
