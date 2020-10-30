import React from 'react';

import { yupResolver } from '@hookform/resolvers';
import { Button, Container, Divider, IconButton, Tooltip, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import DeleteIcon from '@material-ui/icons/Delete';
import RemoveIcon from '@material-ui/icons/Remove';
import { withStyles } from '@material-ui/styles';
import { Link, navigate } from '@reach/router';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

import { FormSubmitButton, FormTextField } from '../../components/Form';
import { useFormServerErrors } from '../../hooks/useFormServerErrors';
import cartSlice, {
  selectCartItems,
  selectCartLength,
  selectCartTotalPrice,
  selectCartTotalQuantity,
} from '../../store/cart/cartSlice';
import productSlice from '../../store/product/productSlice';
import { selectUIState } from '../../store/ui';

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
    fontSize: '18px',
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
  const dispatch = useDispatch();
  const cartTotalPrice = useSelector(selectCartTotalPrice);
  const cartTotalQuantity = useSelector(selectCartTotalQuantity);
  const cartLength = useSelector(selectCartLength);
  const cartItems = useSelector(selectCartItems);
  const methods = useForm(formOpts);
  const { handleSubmit, setError } = methods;
  // const { loading, error } = useSelector(selectUIState(null));
  const error = null;

  React.useEffect(() => {
    if (cartLength === 0) {
      navigate('/');
    }
  }, [cartLength]);

  const onSubmit = async data => {
    console.log(data);
    // await dispatch(xxx(data));
  };

  useFormServerErrors(error, setError);

  return (
    <Container>
      <div className={classes.summaryContent}>
        {cartLength > 0 && (
          <>
            <Typography variant='h2' component='h2' className={classes.summaryTitle}>
              Order Summary
            </Typography>

            <Divider variant='middle' orientation='horizontal' className={classes.divider} />

            <div className={classes.list}>
              {cartItems.map(({ product, quantity }) => (
                <CartListItem key={product.id} product={product} quantity={quantity} />
              ))}
            </div>

            <Button
              size='small'
              color='primary'
              variant='outlined'
              className={classes.clearCartBtn}
              endIcon={<ClearAllIcon />}
              onClick={() => dispatch(cartSlice.actions.clearCartItems())}
            >
              Clear Cart
            </Button>

            <Divider
              variant='middle'
              orientation='horizontal'
              className={classes.divider}
              style={{ marginBottom: '1rem' }}
            />

            <div className={classes.summary}>
              <Typography component='span' variant='subtitle2' color='textPrimary' className={classes.totalQty}>
                Total Quantity: {cartTotalQuantity}
              </Typography>
              <Typography component='span' variant='subtitle2' color='textPrimary' className={classes.totalPrice}>
                Total Price: <strong>${cartTotalPrice}</strong>
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
            <FormTextField name='promo_code' />
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

const CustomTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(16),
    border: '1px solid #dadde9',
  },
}))(Tooltip);

function CartListItem({ product, quantity }) {
  const dispatch = useDispatch();
  const classes = useStyles();

  const handleCardClick = () => {
    dispatch(productSlice.actions.setCurrentId(product.id));
  };

  return (
    <div className={classes.listItem}>
      <div className={classes.listItemContent}>
        <div className={classes.imgNameSection}>
          <Link to={`/${product.id}/${product.slug}`} onClick={handleCardClick} className={classes.link}>
            <img className={classes.listItemImage} src={product.imageUrl} alt={product.name} />
          </Link>
          <Link to={`/${product.id}/${product.slug}`} onClick={handleCardClick} className={classes.link}>
            <Typography className={classes.listItemName} component='h3' variant='subtitle1'>
              {product.name}
            </Typography>
          </Link>
        </div>

        <div className={classes.infoSection}>
          <div className={classes.priceQtySummary}>
            <Typography className={classes.unitPrice} component='span' variant='body2'>
              ${product.price}
            </Typography>
            <Typography className={classes.unitQuantity} component='span' variant='body2'>
              x{quantity}
            </Typography>
            <Typography className={classes.unitSumPrice} component='span' variant='body2'>
              ${product.price * quantity}
            </Typography>
          </div>
          <div className={classes.controls}>
            <CustomTooltip title={<Typography color='inherit'>Increase Quantity</Typography>}>
              <IconButton onClick={() => dispatch(cartSlice.actions.addProductToCart(product))}>
                <AddIcon />
              </IconButton>
            </CustomTooltip>
            <CustomTooltip title={<Typography color='inherit'>Decrease Quantity</Typography>}>
              <IconButton onClick={() => dispatch(cartSlice.actions.removeProductFromCart(product.id))}>
                <RemoveIcon />
              </IconButton>
            </CustomTooltip>
            <CustomTooltip title={<Typography color='inherit'>Remove Item</Typography>}>
              <IconButton onClick={() => dispatch(cartSlice.actions.clearProductFromCart(product.id))}>
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
