import React from 'react';

import { IconButton, makeStyles } from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Slider from 'react-slick';

import ProductCard from './ProductCard';

const useStyles = makeStyles(() => ({
  arrowLeft: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: '50%',
    left: '-30px',
  },
  arrowRight: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: '50%',
    right: '-30px',
  },
  arrowIcon: {
    width: 24,
    height: 24,
  },
}));

function BackArrowButton({ onClick }) {
  const classes = useStyles();

  return (
    <IconButton aria-label='product-left-arrow' color='primary' className={classes.arrowLeft} onClick={onClick}>
      <ArrowBackIosIcon className={classes.arrowIcon} />
    </IconButton>
  );
}

function ForwardArrowButton({ onClick }) {
  const classes = useStyles();

  return (
    <IconButton aria-label='product-right-arrow' color='primary' onClick={onClick} className={classes.arrowRight}>
      <ArrowForwardIosIcon className={classes.arrowIcon} />
    </IconButton>
  );
}

const responsiveSettings = numToShow => ({
  dots: false,
  infinite: true,
  speed: 500,
  autoplay: true,
  slidesToShow: Number.parseInt(numToShow),
  slidesToScroll: Number.parseInt(numToShow),
  arrows: true,
  centerMode: true,
  centerPadding: 0,
  prevArrow: <BackArrowButton />,
  nextArrow: <ForwardArrowButton />,
});

function ProductsSlider({ products }) {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    autoplay: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    centerMode: true,
    centerPadding: 0,
    prevArrow: <BackArrowButton />,
    nextArrow: <ForwardArrowButton />,
    responsive: [
      {
        breakpoint: 320,
        settings: responsiveSettings(1),
      },
      {
        breakpoint: 768,
        settings: responsiveSettings(2),
      },
      {
        breakpoint: 1024,
        settings: responsiveSettings(3),
      },
    ],
  };

  return (
    <div>
      <Slider {...settings} style={{ position: 'relative' }}>
        {products.map(product => (
          <ProductCard key={product.sku} product={product} />
        ))}
      </Slider>
    </div>
  );
}

export default ProductsSlider;
