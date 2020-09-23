import React from 'react';

import { makeStyles } from '@material-ui/core';
import Slider from 'react-slick';

const useStyles = makeStyles(() => ({
  gallery: {
    margin: '5rem 0',
  },
  imgDiv: {
    width: 160,
    height: 120,
  },
  img: {
    width: '100%',
    height: '100%',
    cursor: 'pointer',
    transition: 'transform 0.5s',

    '&:hover': {
      opacity: 0.8,
      transform: 'scale(1.05)',
    },
  },
}));

const responsiveSettings = numToShow => ({
  dots: false,
  infinite: true,
  speed: 500,
  autoplay: true,
  slidesToShow: Number.parseInt(numToShow),
  slidesToScroll: 1,
  arrows: false,
  centerMode: true,
  centerPadding: '50px',
});

function BrandsGrid({ brands }) {
  const classes = useStyles();

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    autoplay: true,
    slidesToShow: 6,
    slidesToScroll: 1,
    arrows: false,
    centerMode: true,
    centerPadding: '50px',
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
      {
        breakpoint: 1200,
        settings: responsiveSettings(4),
      },
    ],
  };

  return (
    <div className={classes.gallery}>
      <Slider {...settings}>
        {brands.map(brand => (
          <BrandSlide key={brand.name} brand={brand} />
        ))}
      </Slider>
    </div>
  );
}

function BrandSlide({ brand }) {
  const classes = useStyles();

  return (
    <div className={classes.imgDiv}>
      <img className={classes.img} src={brand.logo} alt={brand.name} />
    </div>
  );
}

export default BrandsGrid;
