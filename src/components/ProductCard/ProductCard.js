import React, { useContext } from 'react';

import { Card, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import { Skeleton } from '@material-ui/lab';
import { Link } from '@reach/router';

import { useAddProductToWishlist, useDeleteProductFromWishlist, useWishlist } from '../../hooks/queries/userQueries';
import { useIsAuthenticated } from '../../hooks/useIsAuthenticated';
import { formatPriceForDisplay } from '../../utils/priceFormat';
import CustomTooltip from '../CustomTooltip/CustomTooltip';
import { CardDiscountBadge } from '../DiscountBadge/DiscountBadge';
import { CartContext, addProduct } from '../ShoppingCart/CartContext';
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
    position: 'relative',
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
  originalPrice: {
    position: 'relative',
    color: 'rgba(0, 0, 0, 0.4)',

    '&:before': {
      position: 'absolute',
      content: '""',
      left: 0,
      top: '50%',
      maxWidth: 34,
      right: 0,
      borderTop: '1px solid',
      borderColor: 'red',
      transform: 'rotate(-7deg) scale(1.2)',
    },
  },
  iconsWrap: {
    marginTop: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));

function ProductCard({ product }) {
  const classes = useStyles();
  const toast = useContext(ToastContext);
  const { dispatch } = useContext(CartContext);

  const isAuthenticated = useIsAuthenticated();
  const removeFromWishlistMutation = useDeleteProductFromWishlist();
  const addToWishlistMutation = useAddProductToWishlist();
  const { data: userWishlist } = useWishlist({ enabled: isAuthenticated });

  const isProductWishlisted = userWishlist?.some(x => x.id === Number(product?.id));

  const hasDiscountPrice = product?.price < product?.originalPrice;

  const handleAddToCart = () => {
    if (isAuthenticated) {
      dispatch(addProduct(product));
      toast.success('Product added to cart');
    } else {
      toast.info('You need to log in first');
    }
  };

  const handleAddToWishlist = () => {
    if (isAuthenticated) {
      addToWishlistMutation.mutate({ productId: product?.id });
    } else {
      toast.info('You need to log in first');
    }
  };

  const handleRemoveFromWishlist = () => {
    if (isAuthenticated) {
      removeFromWishlistMutation.mutate(product?.id);
    } else {
      toast.info('You need to log in first');
    }
  };

  return (
    <div className={classes.cardOuter}>
      {hasDiscountPrice && (
        <Link to={`/product/${product.id}/${product.slug}`}>
          <CardDiscountBadge product={product} />
        </Link>
      )}

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

        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginTop: 10 }}>
          {hasDiscountPrice && (
            <Typography variant='subtitle1' className={classes.originalPrice}>
              ${product && formatPriceForDisplay(product.originalPrice)}
            </Typography>
          )}

          <Typography
            variant={hasDiscountPrice ? 'h4' : 'subtitle1'}
            className={classes.productPrice}
            style={{ marginLeft: hasDiscountPrice ? 10 : 0 }}
          >
            ${formatPriceForDisplay(product.price)}
          </Typography>
        </div>

        <div className={classes.iconsWrap}>
          {isProductWishlisted ? (
            <CustomTooltip title={<Typography color='inherit'>Remove from wishlist</Typography>}>
              <IconButton className={classes.wishlistRemove} onClick={handleRemoveFromWishlist}>
                <FavoriteIcon style={{ color: 'red', fontSize: 32 }} />
              </IconButton>
            </CustomTooltip>
          ) : (
            <CustomTooltip title={<Typography color='inherit'>Add to wishlist</Typography>}>
              <IconButton className={classes.wishlistAdd} onClick={handleAddToWishlist}>
                <FavoriteBorderIcon style={{ color: 'red', fontSize: 32 }} />
              </IconButton>
            </CustomTooltip>
          )}

          <CustomTooltip title={<Typography color='inherit'>Add to cart</Typography>}>
            <IconButton className={classes.cartAdd} onClick={handleAddToCart}>
              <AddShoppingCartIcon color='primary' style={{ fontSize: 32 }} />
            </IconButton>
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
