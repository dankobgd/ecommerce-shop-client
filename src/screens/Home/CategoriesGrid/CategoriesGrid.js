import React from 'react';

import { makeStyles, Typography, Button } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  grid: {
    display: 'grid',
    justifyItems: 'space-between',
    gridTemplateColumns: 'repeat(auto-fit,minmax(250px, 1fr))',
    gridGap: '1rem',
  },

  figure: {
    fontFamily: 'Raleway, Arial, sans-serif',
    position: 'relative',
    overflow: 'hidden',
    margin: '10px',
    minWidth: '220px',
    maxWidth: '310px',
    maxHeight: '220px',
    width: '100%',
    cursor: 'pointer',
    color: '#fff',
    textAlign: 'center',
    boxShadow: '0 0 5px rgba(0, 0, 0, 0.15)',
    backgroundColor: '#581a14',

    '& *': {
      boxSizing: 'border-box',
      transition: 'all 0.4s ease-in-out',
    },

    '&::before': {
      height: '100%',
      width: '100%',
      top: 0,
      left: 0,
      content: '""',
      background: '#fff',
      position: 'absolute',
      transition: 'all 0.3s ease-in-out',
      transform: 'rotate(110deg) translateY(-50%)',
    },

    '&:hover': {
      '& img': {
        opacity: 1,
        transform: 'scale(1.1)',
      },
      '& h2': {
        transform: 'skew(-10deg) rotate(-10deg) translate(-150%, -50%)',
      },
      '&::before': {
        transform: 'rotate(110deg) translateY(-150%)',
      },
    },
  },

  img: {
    maxWidth: '100%',
    position: 'relative',
    opacity: '0.4',
  },

  figcaption: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },

  h2: {
    position: 'absolute',
    left: '40px',
    right: '40px',
    display: 'inline-block',
    background: '#000',
    transform: 'skew(-10deg) rotate(-10deg) translate(0, -50%)',
    padding: '12px 5px',
    margin: 0,
    top: '50%',
    textTransform: 'uppercase',
    fontWeight: 400,
    backgroundColor: '#36100c',
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

function CategoryCard({ category }) {
  const classes = useStyles();

  return (
    <figure className={classes.figure}>
      <img className={classes.img} src={category.logo} alt={category.name} />
      <figcaption className={classes.figcaption}>
        <h2 className={classes.h2}>{category.name}</h2>
      </figcaption>
    </figure>
  );
}

export default CategoriesGrid;
