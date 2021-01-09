import React, { useContext, useState } from 'react';

import { Container, makeStyles } from '@material-ui/core';

import ScrollTopButton from '../../components/ScrollTop/ScrollTopButton';
import { useBrands } from '../../hooks/queries/brandQueries';
import { useCategories } from '../../hooks/queries/categoryQueries';
import { useInfiniteProducts } from '../../hooks/queries/productQueries';
import { useTags } from '../../hooks/queries/tagQueries';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
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
  const [filterQueryString, setFilterQueryString] = useState('page=1&per_page=20');
  const [shouldFetchAllByFilter, setShouldFetchAllByFilter] = useState(false);
  const loadMoreRef = React.useRef();

  const { data: brands } = useBrands();
  const { data: tags } = useTags();
  const { data: categories } = useCategories();

  const qs = () => new URLSearchParams(filterQueryString).toString();
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage, isLoading, refetch } = useInfiniteProducts(qs(), {
    enabled: false,
  });

  React.useEffect(() => {
    if (shouldFetchAllByFilter && hasSearched) {
      refetch();
    }
  }, [filterQueryString, hasSearched, refetch, shouldFetchAllByFilter]);

  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: hasNextPage,
  });

  const products = data?.pages?.flatMap(page => page.data) ?? [];

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
            products={products}
            hasSearched={hasSearched}
            setFilterQueryString={setFilterQueryString}
            setShouldFetchAllByFilter={setShouldFetchAllByFilter}
            setHasSearched={setHasSearched}
            isLoading={isLoading}
            loadMoreRef={loadMoreRef}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
          />
        </section>
      </Container>

      <ScrollTopButton />
    </div>
  );
}

export default Shop;
