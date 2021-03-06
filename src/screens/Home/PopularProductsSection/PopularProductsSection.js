import React from 'react';

import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from '@reach/router';

import { useFeaturedProducts, useMostSoldProducts, useBestDealsProducts } from '../../../hooks/queries/productQueries';
import { formatPriceForDisplay } from '../../../utils/priceFormat';

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

  const { data: topFeatured } = useFeaturedProducts({ page: 1, per_page: 3 });
  const { data: mostSold } = useMostSoldProducts({ page: 1, per_page: 3 });
  const { data: bestDeals } = useBestDealsProducts({ page: 1, per_page: 3 });

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <div>
            <div>
              <Typography variant='subtitle1' className={classes.title}>
                Top Featured
              </Typography>
              {topFeatured?.data?.map(product => (
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
              {mostSold?.data?.map(product => (
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
              {bestDeals?.data?.map(product => (
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

  return (
    <Paper className={classes.card}>
      <Link to={`/product/${product.id}/${product.slug}`} className={classes.link}>
        <div className={classes.cardInner}>
          <img className={classes.cover} src={product.imageUrl} alt={product.name} />
          <div className={classes.content}>
            <div className={classes.details}>
              <Typography className={classes.name} component='h5' variant='subtitle2'>
                {product.name}
              </Typography>
              <div className={classes.price}>${formatPriceForDisplay(product.price)}</div>
            </div>
          </div>
        </div>
      </Link>
    </Paper>
  );
}

export default PopularProductsSection;
