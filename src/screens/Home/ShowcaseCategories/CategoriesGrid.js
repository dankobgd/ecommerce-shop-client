import React from 'react';

import { makeStyles } from '@material-ui/core';

import CategoryCard from './CategoryCard';

const useStyles = makeStyles(() => ({
  grid: {
    display: 'grid',
    justifyItems: 'space-between',
    gridTemplateColumns: 'repeat(auto-fit,minmax(250px, 1fr))',
    gridGap: '1rem',
  },
}));

function CategoriesGrid({ categories }) {
  const classes = useStyles();

  return (
    <div className={classes.grid}>
      {categories.map(category => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}

export default CategoriesGrid;
