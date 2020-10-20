import React from 'react';

import { makeStyles } from '@material-ui/core';
import { Link } from '@reach/router';
import { useDispatch } from 'react-redux';

import searchSlice from '../../../store/search/searchSlice';

const useStyles = makeStyles(() => ({
  figure: {
    fontFamily: 'Raleway, Arial, sans-serif',
    position: 'relative',
    overflow: 'hidden',
    margin: '10px',
    width: '100%',
    height: '180px',
    maxHeight: '220px',
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
    objectFit: 'cover',
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

function CategoryCard({ category }) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleCategoryChoice = () => {
    dispatch(searchSlice.actions.filterChoiceClicked({ name: 'categories', value: category.name }));
  };

  return (
    <Link to='/shop' onClick={handleCategoryChoice}>
      <figure className={classes.figure}>
        <img className={classes.img} src={category.logo} alt={category.name} />
        <figcaption className={classes.figcaption}>
          <h2 className={classes.h2}>{category.name}</h2>
        </figcaption>
      </figure>
    </Link>
  );
}

export default CategoryCard;
