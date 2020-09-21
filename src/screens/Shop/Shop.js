import React from 'react';

import { Container, Grid, makeStyles } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

import ScrollTopButton from '../../components/ScrollTop/ScrollTopButton';
import { brandGetAll, selectAllBrands } from '../../store/brand/brandSlice';
import { categoryGetAll, selectAllCategories } from '../../store/category/categorySlice';
import {
  productGetAll,
  productGetProperties,
  selectAllProducts,
  selectProductVariants,
} from '../../store/product/productSlice';
import { tagGetAll, selectAllTags } from '../../store/tag/tagSlice';
import Header from '../Home/Header/Header';
import ProductsGrid from './ProductsGrid/ProductsGrid';
import Sidebar from './Sidebar/Sidebar';

const useStyles = makeStyles(() => ({
  shop: {
    display: 'grid',
    gridTemplateColumns: 'minmax(220px, 20%) 1fr',
    marginTop: '1rem',
    marginBottom: '3rem',
  },
  main: {},
}));

function Shop() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const brands = useSelector(selectAllBrands);
  const tags = useSelector(selectAllTags);
  const categories = useSelector(selectAllCategories);
  const products = useSelector(selectAllProducts);
  const variants = useSelector(selectProductVariants);

  React.useEffect(() => {
    if (categories.length === 0) {
      dispatch(categoryGetAll());
    }
    if (brands.length === 0) {
      dispatch(brandGetAll());
    }
    if (tags.length === 0) {
      dispatch(tagGetAll());
    }
    if (variants.length === 0) {
      dispatch(productGetProperties());
    }
    if (products.length === 0) {
      dispatch(productGetAll());
    }
  }, [dispatch, brands.length, tags.length, categories.length, variants.length, products.length]);

  return (
    <div>
      <Header />
      <Container className={classes.shop}>
        <section className={classes.sidebar}>
          <Sidebar variants={variants} tags={tags} brands={brands} categories={categories} />
        </section>
        <section className={classes.main}>
          <ProductsGrid products={products} />
        </section>
      </Container>

      <ScrollTopButton />
    </div>
  );
}

export default Shop;
