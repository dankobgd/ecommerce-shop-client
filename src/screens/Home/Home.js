import React from 'react';

import { Container, makeStyles } from '@material-ui/core';
import { Link } from '@reach/router';
import { useSelector, useDispatch } from 'react-redux';

import ScrollTopButton from '../../components/ScrollTop/ScrollTopButton';
import { selectAllBrands, brandGetAll } from '../../store/brand/brandSlice';
import { selectFeaturedCategories, selectAllCategories, categoryGetFeatured } from '../../store/category/categorySlice';
import { selectFeaturedProducts, productGetFeatured } from '../../store/product/productSlice';
import Header from './Header/Header';
import PopularProductsSection from './PopularProductsSection/PopularProductsSection';
import ShowcaseBrands from './ShowcaseBrands/ShowcaseBrands';
import ShowcaseCategories from './ShowcaseCategories/ShowcaseCategories';
import ShowcaseProducts from './ShowcaseProducts/ShowcaseProducts';

const useStyles = makeStyles(() => ({}));

function Home() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const brands = useSelector(selectAllBrands);
  const categories = useSelector(selectAllCategories);
  const featuredCategories = useSelector(selectFeaturedCategories);
  const featuredProducts = useSelector(selectFeaturedProducts);

  React.useEffect(() => {
    if (featuredProducts.length === 0) {
      dispatch(productGetFeatured());
    }
    if (categories.length === 0) {
      dispatch(categoryGetFeatured());
    }
    if (brands.length === 0) {
      dispatch(brandGetAll());
    }
  }, [dispatch, featuredProducts.length, brands.length, categories.length]);

  return (
    <Container>
      <Header />

      <Link style={{ display: 'block', margin: '2rem' }} to='shop'>
        Shop Page
      </Link>

      <div>
        <ShowcaseCategories categories={featuredCategories} />
        <ShowcaseProducts products={featuredProducts} />

        <div style={{ marginTop: '3rem' }}>
          <PopularProductsSection />
        </div>

        <ShowcaseBrands brands={brands} />
      </div>

      <ScrollTopButton />
    </Container>
  );
}

export default Home;
