import React, { useContext } from 'react';

import { Card, Fab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import { Skeleton } from '@material-ui/lab';
import { Link } from '@reach/router';

import { formatPriceForDisplay } from '../../utils/priceFormat';
import CustomTooltip from '../CustomTooltip/CustomTooltip';
import { CartContext } from '../ShoppingCart/CartContext';
import { ToastContext } from '../Toast/ToastContext';

const useStyles = makeStyles(theme => ({
  cardOuter: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '1rem',
    border: '1px solid #f3f3f3',
    backgroundColor: '#fff',
    margin: '0 1rem',
    borderRadius: '6px',
    boxShadow: theme.shadows[2],
  },
  cardMedia: {
    width: '100%',
    height: '320px',
    '& img ': {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
  },
  brandWrapper: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '10px',
    width: '60px',
    height: '45px',
  },
  brandLogo: {
    '& img': {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
    },
  },
  cardContent: {
    padding: '6px 0',
  },
  productName: {
    fontWeight: 'bold',
    transition: 'all 500ms',
    '&:hover': {
      color: theme.palette.primary.dark,
    },
  },
  productPrice: {},
  add: {
    marginTop: '1rem',
    display: 'flex',
    justifyContent: 'flex-end',
  },
}));

function ProductCard({ product }) {
  const classes = useStyles();
  const toast = useContext(ToastContext);
  const cart = useContext(CartContext);

  const handleAddToCart = () => {
    cart.addProduct(product);
    toast.success('Product added to cart');
  };

  return (
    <div className={classes.cardOuter}>
      <div className={classes.brandWrapper}>
        <CustomTooltip title={<Typography color='inherit'>{product?.brand?.name}</Typography>}>
          <div className={classes.brandLogo}>
            <img src={product?.brand?.logo} alt={product?.brand?.name || 'brand logo'} />
          </div>
        </CustomTooltip>
      </div>
      <Link to={`/product/${product.id}/${product.slug}`}>
        <div className={classes.cardMedia}>
          <img src={product.imageUrl} alt={product.name} />
        </div>
      </Link>
      <div className={classes.cardContent}>
        <Link to={`/product/${product.id}/${product.slug}`} style={{ textDecoration: 'none' }}>
          <Typography variant='subtitle1' className={classes.productName}>
            {product.name}
          </Typography>
        </Link>
        <Typography variant='subtitle1' className={classes.productPrice}>
          ${formatPriceForDisplay(product.price)}
        </Typography>

        <div className={classes.add}>
          <CustomTooltip title={<Typography color='inherit'>Add to cart</Typography>}>
            <Fab color='primary' variant='round' size='medium' onClick={handleAddToCart}>
              <AddShoppingCartIcon />
            </Fab>
          </CustomTooltip>
        </div>
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <Card
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: '100%',
        padding: '1rem',
      }}
    >
      <Skeleton variant='circle' width={50} height={50} style={{ marginBottom: 4 }} />
      <Skeleton variant='rect' style={{ width: '100%' }} height={250} />
      <Skeleton variant='text' width={170} height={30} />
      <Skeleton variant='text' width={60} height={30} />
      <Skeleton variant='circle' width={50} height={50} style={{ marginLeft: 'auto', marginTop: 4 }} />
    </Card>
  );
}

export default ProductCard;
