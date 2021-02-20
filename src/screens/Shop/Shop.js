import React, { useContext } from 'react';

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
  const { shop, dispatch } = useContext(ShopContext);
  const loadMoreRef = React.useRef();

  const { data: brands } = useBrands();
  const { data: tags } = useTags();
  const { data: categories } = useCategories();

  const {
    data,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isLoading,
    refetch,
  } = useInfiniteProducts(shop.filterQueryString, { enabled: false });

  React.useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (shop.shouldRefetchProducts) {
      refetch();
    }
  }, [shop.filterQueryString, refetch, dispatch, shop.shouldRefetchProducts]);

  const products = data?.pages?.flatMap(page => page.data) ?? [];

  const totalProducts = data?.pages?.[data?.pages?.length - 1]?.meta?.totalCount;

  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: !!(hasNextPage && !isFetchingNextPage && products?.length >= 20),
  });

  return (
    <div>
      <Header />

      <Container className={classes.shop}>
        <section className={classes.filter}>
          <Filter tagsList={tags?.data ?? []} brandsList={brands?.data ?? []} categoriesList={categories?.data ?? []} />
        </section>
        <section className={classes.main}>
          <ProductsGrid
            products={products}
            isLoading={isLoading}
            loadMoreRef={loadMoreRef}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            totalProducts={totalProducts}
          />
        </section>
      </Container>

      <ScrollTopButton />
    </div>
  );
}

export default Shop;
