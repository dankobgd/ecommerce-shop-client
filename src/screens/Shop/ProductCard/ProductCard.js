import React from 'react';

import { Tooltip, Fab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import { withStyles } from '@material-ui/styles';
import { Link } from '@reach/router';
import { useDispatch } from 'react-redux';

import productSlice from '../../../store/product/productSlice';

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

const CustomTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(16),
    border: '1px solid #dadde9',
  },
}))(Tooltip);

function ProductCard({ product }) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleCardClick = () => {
    dispatch(productSlice.actions.setCurrentId(product.id));
  };

  return (
    <div className={classes.cardOuter}>
      <div className={classes.brandWrapper}>
        <CustomTooltip title={<Typography color='inherit'>{product.brand.name}</Typography>}>
          <div className={classes.brandLogo}>
            <img src={product.brand.logo} alt={product.brand.name} />
          </div>
        </CustomTooltip>
      </div>
      <Link to={`${product.id}/${product.slug}`} onClick={handleCardClick}>
        <div className={classes.cardMedia}>
          <img src={product.imageUrl} alt={product.name} />
        </div>
      </Link>
      <div className={classes.cardContent}>
        <Link to={`${product.id}/${product.slug}`} onClick={handleCardClick} style={{ textDecoration: 'none' }}>
          <Typography variant='subtitle1' className={classes.productName}>
            {product.name}
          </Typography>
        </Link>
        <Typography variant='subtitle1' className={classes.productPrice}>
          ${product.price}
        </Typography>

        <div className={classes.add}>
          <CustomTooltip title={<Typography color='inherit'>Add to cart</Typography>}>
            <Fab color='primary' variant='round' size='medium'>
              <AddShoppingCartIcon />
            </Fab>
          </CustomTooltip>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
