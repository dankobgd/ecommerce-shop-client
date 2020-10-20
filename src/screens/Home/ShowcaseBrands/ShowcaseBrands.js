import React from 'react';

import { makeStyles } from '@material-ui/core';
import { Link } from '@reach/router';
import { useDispatch } from 'react-redux';
import Slider from 'react-slick';

import searchSlice from '../../../store/search/searchSlice';

const useStyles = makeStyles(() => ({
  gallery: {
    margin: '5rem 0',
  },
  imgDiv: {
    width: 120,
    height: 80,
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
  const dispatch = useDispatch();

  const handleBrandChoice = () => {
    dispatch(searchSlice.actions.filterChoiceClicked({ name: 'brands', value: brand.name }));
  };

  return (
    <Link to='/shop' onClick={handleBrandChoice}>
      <div className={classes.imgDiv}>
        <img className={classes.img} src={brand.logo} alt={brand.name} />
      </div>
    </Link>
  );
}

export default BrandsGrid;
