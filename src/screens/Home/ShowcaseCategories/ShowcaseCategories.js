import React from 'react';

import { Typography } from '@material-ui/core';

import { useFeaturedCategories } from '../../../hooks/queries/categoryQueries';
import CategoriesGrid from './CategoriesGrid';

function ShowcaseCategories() {
  const { data: categories } = useFeaturedCategories();

  return (
    <div>
      <Typography variant='h2' component='h2' gutterBottom>
        Featured Categories
      </Typography>
      <CategoriesGrid categories={categories?.data} />
    </div>
  );
}

export default ShowcaseCategories;
