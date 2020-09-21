import React from 'react';

import { Typography } from '@material-ui/core';

import CategoriesGrid from './CategoriesGrid';

function ShowcaseCategories({ categories }) {
  return (
    <div>
      <Typography variant='h2' component='h2' gutterBottom>
        Featured Categories
      </Typography>
      <CategoriesGrid categories={categories} />
    </div>
  );
}

export default ShowcaseCategories;
