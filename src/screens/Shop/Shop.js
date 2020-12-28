import React, { useContext, useState } from 'react';

import { Container, makeStyles } from '@material-ui/core';

import ScrollTopButton from '../../components/ScrollTop/ScrollTopButton';
import { useBrands } from '../../hooks/queries/brandQueries';
import { useCategories } from '../../hooks/queries/categoryQueries';
import { useProducts } from '../../hooks/queries/productQueries';
import { useTags } from '../../hooks/queries/tagQueries';
import Header from '../Home/Header/Header';
import Filter from './Filter/Filter';
import ProductsGrid from './ProductsGrid/ProductsGrid';
import { ShopContext } from './ShopContext';

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
  const { hasSearched, setHasSearched } = useContext(ShopContext);
  const [filterQueryString, setFilterQueryString] = useState('');
  const [shouldFetchAllByFilter, setShouldFetchAllByFilter] = useState(false);
  const [shouldShowDefaultProducts, setShouldShowDefaultProducts] = useState(false);

  const { data: brands } = useBrands();
  const { data: tags } = useTags();
  const { data: categories } = useCategories();
  const { data: products, refetch } = useProducts(filterQueryString, { enabled: false });

  React.useEffect(() => {
    if (
      (shouldFetchAllByFilter && hasSearched && !!filterQueryString) ||
      (shouldFetchAllByFilter && hasSearched && filterQueryString === '' && shouldShowDefaultProducts)
    ) {
      refetch();
    }
  }, [filterQueryString, hasSearched, refetch, shouldFetchAllByFilter, shouldShowDefaultProducts]);

  return (
    <div>
      <Header />
      <Container className={classes.shop}>
        <section className={classes.filter}>
          <Filter
            tagsList={tags?.data ?? []}
            brandsList={brands?.data ?? []}
            categoriesList={categories?.data ?? []}
            setFilterQueryString={setFilterQueryString}
            setShouldFetchAllByFilter={setShouldFetchAllByFilter}
          />
        </section>
        <section className={classes.main}>
          <ProductsGrid
            products={products?.data ?? []}
            hasSearched={hasSearched}
            setFilterQueryString={setFilterQueryString}
            setShouldFetchAllByFilter={setShouldFetchAllByFilter}
            setHasSearched={setHasSearched}
            shouldShowDefaultProducts={shouldShowDefaultProducts}
            setShouldShowDefaultProducts={setShouldShowDefaultProducts}
          />
        </section>
      </Container>

      <ScrollTopButton />
    </div>
  );
}

export default Shop;
