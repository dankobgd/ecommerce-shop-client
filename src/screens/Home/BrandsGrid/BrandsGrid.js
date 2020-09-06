import React from 'react';

import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  grid: {
    marginTop: '5rem',
    display: 'grid',
    justifyItems: 'space-between',
    gridTemplateColumns: 'repeat(auto-fit,minmax(250px, 1fr))',
    gridGap: '1rem',
  },

  figure: {
    position: 'relative',
    overflow: 'hidden',
    margin: '10px',
    minWidth: '220px',
    maxWidth: '310px',
    maxHeight: '220px',
    width: '100%',
    cursor: 'pointer',
    textAlign: 'center',
    backgroundColor: '#3085a3',

    '&:hover': {
      '& img': {
        transform: 'scale(1.1)',
        opacity: 0.4,
      },

      '& figcaption::before, & figcaption::after': {
        opacity: 1,
        transform: 'scale(1)',
      },

      '& h2': {
        opacity: 1,
        transform: 'translate3d(0,0,0)',
      },
    },
  },

  img: {
    position: 'relative',
    display: 'block',
    minHeight: '100%',
    maxWidth: '100%',
    opacity: 0.7,
    transition: 'all 0.35s',
  },

  figcaption: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2em',
    color: '#fff',
    textTransform: 'uppercase',
    fontSize: '1.25em',
    backfaceVisibility: 'hidden',

    '&::before, &::after': {
      position: 'absolute',
      top: '30px',
      right: '30px',
      bottom: '30px',
      left: '30px',
      content: '""',
      opacity: 0,
      transition: 'opacity 0.35s, transform 0.35s',
    },

    '&::before': {
      borderTop: '1px solid #fff',
      borderBottom: '1px solid #fff',
      transform: 'scale(0,1)',
    },

    '&::after': {
      borderRight: '1px solid #fff',
      borderLeft: '1px solid #fff',
      transform: 'scale(1,0)',
    },
  },

  h2: {
    wordSpacing: '-0.15em',
    fontWeight: 300,
    margin: 0,
    opacity: 0,
    transition: 'opacity 0.5s',
  },
}));

function BrandsGrid({ brands }) {
  const classes = useStyles();
  return (
    <div className={classes.grid}>
      {brands.map(brand => (
        <BrandCard key={brand.id} brand={brand} />
      ))}
    </div>
  );
}

export function BrandCard({ brand }) {
  const classes = useStyles();

  return (
    <figure className={classes.figure}>
      <img className={classes.img} src={brand.logo} alt={brand.name} />
      <figcaption className={classes.figcaption}>
        <h2 className={classes.h2}>{brand.name}</h2>
      </figcaption>
    </figure>
  );
}

export default BrandsGrid;
