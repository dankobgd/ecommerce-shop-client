import React from 'react';

import { Container, makeStyles, Typography } from '@material-ui/core';
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

      <Link style={{ display: 'flex', margin: '2rem 0', textDecoration: 'none' }} to='shop'>
        <Typography variant='h3'>Visit Shop Page</Typography>
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
