import React from 'react';

import { Container, makeStyles } from '@material-ui/core';
import { Link } from '@reach/router';

import ScrollTopButton from '../../components/ScrollTop/ScrollTopButton';
import Header from './Header/Header';
import PopularProductsSection from './PopularProductsSection/PopularProductsSection';
import ShowcaseBrands from './ShowcaseBrands/ShowcaseBrands';
import ShowcaseCategories from './ShowcaseCategories/ShowcaseCategories';
import ShowcaseProducts from './ShowcaseProducts/ShowcaseProducts';

const useStyles = makeStyles(() => ({
  popular: {
    marginTop: '3rem',
  },
}));

function Home() {
  const classes = useStyles();

  return (
    <Container>
      <Header />

      <Link style={{ display: 'flex', marginTop: '3rem' }} to='shop'>
        Shop Page
      </Link>
      <Link style={{ display: 'flex' }} to='/checkout' state={{ prevPath: window.location.pathname }}>
        Checkout Page
      </Link>

      <div>
        <ShowcaseCategories />
        <ShowcaseProducts />

        <div className={classes.popular}>
          <PopularProductsSection />
        </div>

        <ShowcaseBrands />
      </div>

      <ScrollTopButton />
    </Container>
  );
}

export default Home;
