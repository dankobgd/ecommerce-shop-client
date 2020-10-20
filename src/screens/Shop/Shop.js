import React from 'react';

import { Container, makeStyles } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

import ScrollTopButton from '../../components/ScrollTop/ScrollTopButton';
import { brandGetAll, selectAllBrands } from '../../store/brand/brandSlice';
import { categoryGetAll, selectAllCategories } from '../../store/category/categorySlice';
import { productGetProperties, selectProductVariants } from '../../store/product/productSlice';
import { selectAllSearchProducts, selectHasSearched } from '../../store/search/searchSlice';
import { tagGetAll, selectAllTags } from '../../store/tag/tagSlice';
import Header from '../Home/Header/Header';
import Filter from './Filter/Filter';
import ProductsGrid from './ProductsGrid/ProductsGrid';

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
  const searchProducts = useSelector(selectAllSearchProducts);
  const variants = useSelector(selectProductVariants);
  const hasSearched = useSelector(selectHasSearched);

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
    if (Object.keys(variants).length === 0) {
      dispatch(productGetProperties());
    }
  }, [brands.length, categories.length, dispatch, tags.length, variants]);

  return (
    <div>
      <Header />
      <Container className={classes.shop}>
        <section className={classes.filter}>
          <Filter variants={variants} tagsList={tags} brandsList={brands} categoriesList={categories} />
        </section>
        <section className={classes.main}>
          <ProductsGrid products={searchProducts} hasSearched={hasSearched} />
        </section>
      </Container>

      <ScrollTopButton />
    </div>
  );
}

export default Shop;
