import React from 'react';

import { Container, makeStyles } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

import ScrollTopButton from '../../components/ScrollTop/ScrollTopButton';
import { brandGetAll, selectAllBrands } from '../../store/brand/brandSlice';
import { categoryGetAll, selectAllCategories } from '../../store/category/categorySlice';
import { productGetProperties, selectProductVariants } from '../../store/product/productSlice';
import { filterProducts, selectAllSearchProducts } from '../../store/search/searchSlice';
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
  const searchProducts = useSelector(selectAllSearchProducts);
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
    if (searchProducts.length === 0) {
      dispatch(filterProducts());
    }
  }, [dispatch, brands.length, tags.length, categories.length, variants.length, searchProducts.length]);

  return (
    <div>
      <Header />
      <Container className={classes.shop}>
        <section className={classes.sidebar}>
          <Sidebar variants={variants} tags={tags} brands={brands} categories={categories} />
        </section>
        <section className={classes.main}>
          <ProductsGrid products={searchProducts} />
        </section>
      </Container>

      <ScrollTopButton />
    </div>
  );
}

export default Shop;
