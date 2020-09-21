import React from 'react';

import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from '@reach/router';
import { useDispatch, useSelector } from 'react-redux';

import productSlice, {
  selectBeastDealsProducts,
  selectMostSoldProducts,
  selectTopFeaturedProducts,
} from '../../../store/product/productSlice';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  title: {
    borderLeft: '10px solid purple',
    backgroundColor: '#F0F5F9',
    padding: '10px 20px 10px 10px',
    minWidth: '200px',
    maxWidth: '300px',
    width: '100%',
  },
}));

const useCardStyles = makeStyles(() => ({
  card: {
    marginTop: '1rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    minWidth: '200px',
    maxWidth: '300px',
    width: '100%',
  },
  link: {
    width: '100%',
    textDecoration: 'none',
  },
  cardInner: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    minWidth: '200px',
    maxWidth: '300px',
    width: '100%',
  },
  cover: {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    maxWidth: '100px',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {},
  price: {},
}));

function PopularProductsSection() {
  const classes = useStyles();
  const topFeatured = useSelector(selectTopFeaturedProducts);
  const mostSold = useSelector(selectMostSoldProducts);
  const bestDeals = useSelector(selectBeastDealsProducts);

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <div>
            <div>
              <Typography variant='subtitle1' className={classes.title}>
                Top Featured
              </Typography>
              {topFeatured.map(product => (
                <ProductListCard key={product.sku} product={product} />
              ))}
            </div>
          </div>
        </Grid>
        <Grid item xs={12} sm={4}>
          <div>
            <div>
              <Typography variant='subtitle1' className={classes.title}>
                Most Sold
              </Typography>
              {mostSold.map(product => (
                <ProductListCard key={product.sku} product={product} />
              ))}
            </div>
          </div>
        </Grid>
        <Grid item xs={12} sm={4}>
          <div>
            <div>
              <Typography variant='subtitle1' className={classes.title}>
                Best Deals
              </Typography>
              {bestDeals.map(product => (
                <ProductListCard key={product.sku} product={product} />
              ))}
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

function ProductListCard({ product }) {
  const classes = useCardStyles();
  const dispatch = useDispatch();

  const handleCardClick = () => {
    dispatch(productSlice.actions.setCurrentId(product.id));
  };

  return (
    <Paper className={classes.card}>
      <Link to={`${product.id}/${product.slug}`} onClick={handleCardClick} className={classes.link}>
        <div className={classes.cardInner}>
          <img className={classes.cover} src={product.imageUrl} alt={product.name} />
          <div className={classes.content}>
            <div className={classes.details}>
              <Typography className={classes.name} component='h5' variant='subtitle2'>
                {product.name}
              </Typography>
              <div className={classes.price}>${product.price}</div>
            </div>
          </div>
        </div>
      </Link>
    </Paper>
  );
}

export default PopularProductsSection;
