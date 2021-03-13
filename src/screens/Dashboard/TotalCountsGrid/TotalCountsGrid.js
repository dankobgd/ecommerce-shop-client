import React from 'react';

import { Grid } from '@material-ui/core';
import CategoryIcon from '@material-ui/icons/Category';
import ClassIcon from '@material-ui/icons/Class';
import LabelIcon from '@material-ui/icons/Label';
import LoyaltyIcon from '@material-ui/icons/Loyalty';
import PaymentIcon from '@material-ui/icons/Payment';
import PeopleIcon from '@material-ui/icons/People';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';

import { useBrandsCount } from '../../../hooks/queries/brandQueries';
import { useCategoriesCount } from '../../../hooks/queries/categoryQueries';
import { useOrdersCount } from '../../../hooks/queries/orderQueries';
import { useProductsCount } from '../../../hooks/queries/productQueries';
import { usePromotionsCount } from '../../../hooks/queries/promotionQueries';
import { useTagsCount } from '../../../hooks/queries/tagQueries';
import { useUsersCount } from '../../../hooks/queries/userQueries';
import { TotalCountCard } from './TotalCountCard';

const colors = ['#43aa8b', 'darkred', '#6d597a', '#457b9d', '#1d3557', '#b5838d', 'purple'];

export function TotalCountsGrid() {
  const { data: usersCount } = useUsersCount();
  const { data: productsCount } = useProductsCount();
  const { data: categoriesCount } = useCategoriesCount();
  const { data: brandsCount } = useBrandsCount();
  const { data: tagsCount } = useTagsCount();
  const { data: promotionsCount } = usePromotionsCount();
  const { data: ordersCount } = useOrdersCount();

  const items = [
    { title: 'Total Users', count: usersCount?.count, icon: <PeopleIcon /> },
    { title: 'Total Orders', count: ordersCount?.count, icon: <PaymentIcon /> },
    { title: 'Total Products', count: productsCount?.count, icon: <ShoppingBasketIcon /> },
    { title: 'Total Categories', count: categoriesCount?.count, icon: <CategoryIcon /> },
    { title: 'Total Brands', count: brandsCount?.count, icon: <ClassIcon /> },
    { title: 'Total Tags', count: tagsCount?.count, icon: <LabelIcon /> },
    { title: 'Total Promotions', count: promotionsCount?.count, icon: <LoyaltyIcon /> },
  ];

  return (
    <Grid container spacing={4}>
      {items.map(({ title, count, icon }, i) => (
        <Grid key={title} item lg={3} sm={6} xl={3} xs={12}>
          <TotalCountCard title={title} count={count} icon={icon} bg={colors[i]} />
        </Grid>
      ))}
    </Grid>
  );
}
