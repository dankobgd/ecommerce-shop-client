import React, { useContext, useState } from 'react';

import { Button, Divider, IconButton, Typography } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import RemoveIcon from '@material-ui/icons/Remove';
import { Link } from '@reach/router';
import clsx from 'clsx';

import { formatPriceForDisplay, formatPriceUnitSum } from '../../utils/priceFormat';
import CustomTooltip from '../CustomTooltip/CustomTooltip';
import {
  addProduct,
  CartContext,
  clearItems,
  clearProduct,
  closeDrawer,
  removeProduct,
  toggleDrawer,
} from './CartContext';

const useStyles = makeStyles({
  cartContent: {
    width: 400,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    padding: '2rem 1rem',
    position: 'relative',
  },
  cartTitle: {
    margin: '1rem 0',
  },
  link: {
    textDecoration: 'none',
  },
  close: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 10,
    right: 10,
    cursor: 'pointer',
    transition: 'all 0.5s',
    '&:hover': {
      backgroundColor: '#f3f3f3',
    },
    borderRadius: '4px',
    padding: '10px',
    border: 'none',
    backgroundColor: '#fff',
  },

  clearCartBtn: {
    marginBottom: '1rem',
    marginLeft: 'auto',
  },
  checkoutBtn: {
    marginTop: '1rem',
  },
  divider: {
    width: '100%',
  },
  summary: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
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
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
  listItemInner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    marginLeft: '12px',
  },
  listItemImage: {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
  },
  listItemDetails: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  details: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  controls: {
    display: 'flex',
    justifyContent: 'center',
    flex: 1,
    transition: 'all 0.3s',
    height: '0px',

    '&.active': {
      height: '40px',
    },
  },
  controlIcons: {
    transition: 'all 0.3s',
    transform: 'scaleY(0)',
    opacity: 0,

    '&.active': {
      transform: 'scaleY(1)',
      opacity: 1,
    },
  },
  listItemName: {
    fontWeight: 'bold',
    flexBasis: '70%',
  },
  listItemPrice: {
    fontSize: '12px',
    marginLeft: '4px',
    flexBasis: '20%',
  },
  pricePart: {},
  qtyPart: {
    marginLeft: '6px',
  },
  sumPart: {
    color: '#2c365e',
    marginLeft: '6px',
    fontSize: '14px',
    fontWeight: 500,
  },
});

function ShoppingCart({ anchor = 'right' }) {
  const classes = useStyles();
  const { cart, dispatch } = useContext(CartContext);

  return (
    <Drawer anchor={anchor} open={cart.drawerOpen} onClose={() => dispatch(toggleDrawer())}>
      <div className={classes.cartContent}>
        {cart?.items?.length > 0 ? (
          <>
            <Typography variant='subtitle1' component='h2' className={classes.cartTitle}>
              Shopping Cart Items
            </Typography>

            <Divider variant='middle' orientation='horizontal' className={classes.divider} />

            <button type='button' className={classes.close} onClick={() => dispatch(closeDrawer())}>
              <CloseIcon />
            </button>

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
              onClick={() => dispatch(clearItems())}
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
              <Typography component='span' variant='subtitle2' color='textPrimary'>
                Total Quantity: {cart?.totalQuantity}
              </Typography>
              <Typography component='span' variant='subtitle2' color='textPrimary'>
                Subtotal Price: <strong>${formatPriceForDisplay(cart?.subtotalPrice)}</strong>
              </Typography>
            </div>

            <Link
              to='/checkout'
              style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center', width: '100%' }}
              onClick={() => dispatch(toggleDrawer())}
            >
              <Button color='primary' variant='contained' fullWidth className={classes.checkoutBtn}>
                Go To Checkout
              </Button>
            </Link>
          </>
        ) : (
          <>
            <button type='button' className={classes.close} onClick={() => dispatch(toggleDrawer())}>
              <CloseIcon />
            </button>
            <Typography component='h3' variant='subtitle1' color='textPrimary'>
              <strong>No items in cart!</strong>
            </Typography>
          </>
        )}
      </div>
    </Drawer>
  );
}

function CartListItem({ product, quantity }) {
  const [isHover, setIsHover] = useState(false);
  const classes = useStyles({ isHover });
  const { dispatch } = useContext(CartContext);

  const onMouseEnter = () => {
    setIsHover(true);
  };
  const onMouseLeave = () => {
    setIsHover(false);
  };

  return (
    <div className={classes.listItem} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <div className={classes.listItemContent}>
        <Link to={`/${product.id}/${product.slug}`} className={classes.link}>
          <img className={classes.listItemImage} src={product.imageUrl} alt={product.name} />
        </Link>
        <div className={classes.listItemInner}>
          <div className={classes.listItemDetails}>
            <div className={classes.details}>
              <Link to={`/${product.id}/${product.slug}`} className={classes.link}>
                <Typography className={classes.listItemName} component='h3' variant='subtitle2'>
                  {product.name}
                </Typography>
              </Link>
              <Typography className={classes.listItemPrice} component='span' variant='body2'>
                <span className={classes.pricePart}>${formatPriceForDisplay(product.price)}</span>
                <span className={classes.qtyPart}>x{quantity}</span>
                <span className={classes.sumPart}>${formatPriceUnitSum(product.price, quantity)}</span>
              </Typography>
            </div>

            <div className={clsx(classes.controls, isHover && 'active')}>
              <div className={clsx(classes.controlIcons, isHover && 'active')}>
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
      </div>
    </div>
  );
}

export default ShoppingCart;
