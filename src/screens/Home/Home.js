import React from 'react';

import { makeStyles } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';

import { selectAllBrands, brandGetAll } from '../../store/brand/brandSlice';
import { selectFeaturedCategories, categoryGetAll, selectAllCategories } from '../../store/category/categorySlice';
import {
  productGetProperties,
  selectProductVariants,
  selectFeaturedProducts,
  productGetFeatured,
} from '../../store/product/productSlice';
import { tagGetAll, selectAllTags } from '../../store/tag/tagSlice';
import BrandsGrid from './BrandsGrid/BrandsGrid';
import CategoriesGrid from './CategoriesGrid/CategoriesGrid';
import Header from './Header/Header';
import ProductsGrid from './ProductsGrid/ProductsGrid';
import SideBar from './SideBar/SideBar';

const useStyles = makeStyles(() => ({
  categoriesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gridGap: '1rem',
  },
  brandsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gridGap: '1rem',
  },

  homeOuter: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 1rem',
  },
  homeView: {
    display: 'grid',
    gridTemplateColumns: 'minmax(300px, 25%) 1fr',
  },
}));

function Home() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const brands = useSelector(selectAllBrands);
  const categories = useSelector(selectAllCategories);
  const tags = useSelector(selectAllTags);
  const variants = useSelector(selectProductVariants);
  const featuredCategories = useSelector(selectFeaturedCategories);
  const featuredProducts = useSelector(selectFeaturedProducts);

  React.useEffect(() => {
    dispatch(productGetProperties());

    if (featuredProducts.length === 0) {
      dispatch(productGetFeatured());
    }
    if (categories.length === 0) {
      dispatch(categoryGetAll());
    }
    if (brands.length === 0) {
      dispatch(brandGetAll());
    }
    if (tags.length === 0) {
      dispatch(tagGetAll());
    }
  }, [dispatch, featuredProducts.length, brands.length, categories.length, tags.length]);

  return (
    <div className={classes.homeOuter}>
      <Header />
      <div>
        <CategoriesGrid categories={featuredCategories} />
        <BrandsGrid brands={brands} />
      </div>
      <div className={classes.homeView}>
        <SideBar brands={brands} categories={categories} tags={tags} variants={variants} />
        <ProductsGrid products={featuredProducts} />
      </div>
    </div>
  );
}

export default Home;
