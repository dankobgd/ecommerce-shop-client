import React from 'react';

import { makeStyles } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';

import { selectAllBrands, brandGetAll } from '../../store/brand/brandSlice';
import { selectAllCategories, categoryGetAll } from '../../store/category/categorySlice';
import { selectAllProducts, productGetAll } from '../../store/product/productSlice';
import { selectUIState } from '../../store/ui';
import BrandsGrid from './BrandsGrid/BrandsGrid';
import CategoriesGrid from './CategoriesGrid/CategoriesGrid';
import Header from './Header/Header';
import ProductsGrid from './ProductsGrid/ProductsGrid';
import SideBar from './SideBar/SideBar';

const useStyles = makeStyles(theme => ({
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
  const products = useSelector(selectAllProducts);
  const brands = useSelector(selectAllBrands);
  const categories = useSelector(selectAllCategories);
  const { loading, error } = useSelector(selectUIState(productGetAll));

  React.useEffect(() => {
    async function fetchProducts() {
      await dispatch(productGetAll());
      await dispatch(categoryGetAll());
      await dispatch(brandGetAll());
    }
    fetchProducts();
  }, [dispatch]);

  return (
    <div className={classes.homeOuter}>
      <Header />
      <div>
        <CategoriesGrid categories={categories} />
        <BrandsGrid brands={brands} />
      </div>
      {/* <div className={classes.homeView}>
        <SideBar />
        <ProductsGrid products={products} />
      </div> */}
    </div>
  );
}

export default Home;
