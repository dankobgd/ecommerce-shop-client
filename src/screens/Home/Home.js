import React from 'react';

import { Container, makeStyles } from '@material-ui/core';
import { Link } from '@reach/router';
import { useSelector, useDispatch } from 'react-redux';

import ScrollTopButton from '../../components/ScrollTop/ScrollTopButton';
import { selectAllBrands, brandGetAll } from '../../store/brand/brandSlice';
import { selectFeaturedCategories, categoryGetAll } from '../../store/category/categorySlice';
import { selectFeaturedProducts, productGetFeatured } from '../../store/product/productSlice';
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
  const dispatch = useDispatch();
  const classes = useStyles();
  const brands = useSelector(selectAllBrands);
  const featuredCategories = useSelector(selectFeaturedCategories);
  const featuredProducts = useSelector(selectFeaturedProducts);

  React.useEffect(() => {
    if (featuredProducts.length === 0) {
      dispatch(productGetFeatured());
    }
    if (featuredCategories.length === 0) {
      dispatch(categoryGetAll());
    }
    if (brands.length === 0) {
      dispatch(brandGetAll());
    }
  }, [dispatch, brands.length, featuredProducts.length, featuredCategories.length]);

  return (
    <Container>
      <Header />

      <Link style={{ display: 'flex' }} to='shop'>
        Shop Page
      </Link>
      <Link style={{ display: 'flex' }} to='checkout'>
        Checkout Page
      </Link>

      <div>
        <ShowcaseCategories categories={featuredCategories} />
        <ShowcaseProducts products={featuredProducts} />

        <div className={classes.popular}>
          <PopularProductsSection />
        </div>

        <ShowcaseBrands brands={brands} />
      </div>

      <ScrollTopButton />
    </Container>
  );
}

export default Home;
