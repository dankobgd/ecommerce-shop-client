/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from 'react';

import { Button, Chip, Container, Grid, IconButton, makeStyles, Typography } from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import { Rating } from '@material-ui/lab';
import { nanoid } from 'nanoid';
import ReactImageMagnify from 'react-image-magnify';
import { useDispatch, useSelector } from 'react-redux';

import { selectBrandById } from '../../store/brand/brandSlice';
import { selectCurrentProduct } from '../../store/product/productSlice';
import { imageGetAllForProduct, selectManyProductImages } from '../../store/product_image/productImageSlice';
import { reviewGetAllForProduct, selectManyReviews, selectAverageProductRating } from '../../store/review/reviewSlice';
import { tagGetAllForProduct, selectManyTags } from '../../store/tag/tagSlice';

const useStyles = makeStyles(() => ({
  gallerySection: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewBig: {
    border: '1px solid purple',
  },
  previewList: {
    marginTop: '1rem',
    border: '1px solid orange',
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },

  imgDiv: {
    width: '100px',
    height: '60px',
  },
  img: {
    cursor: 'pointer',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },

  infoSection: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  details: {
    margin: '3rem 0',
  },
  detailsTitle: {
    marginBottom: '8px',
  },
  detailsText: {},

  description: {},
  descriptionTitle: {},
  descriptionText: {},

  reviews: {
    margin: '3rem 0',
  },
  reviewsTitle: {
    marginBottom: '7px',
  },
  reviewsNum: {
    fontWeight: '500',
    color: '#a3a3a3',
  },
  reviewsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1rem',
  },
  reviewCard: {
    backgroundColor: '#fff',
    padding: '1rem',
    borderRadius: '4px',
    border: '1px solid #e5e5e5',
  },
  reviewRating: {},
  reviewTitle: {},
  reviewMeta: {},
  reviewComment: {
    marginTop: '8px',
  },
}));

const chipColors = [
  'purple',
  'darkred',
  '#264653',
  '#457b9d',
  '#1d3557',
  '#b5838d',
  '#43aa8b',
  '#5f0f40',
  '#9a031e',
  '#6d597a',
  '#3c096c',
  '#da627d',
  '#ffbc42',
  '#8f2d56',
  '#7d4e57',
  '#87bba2',
  '#f6ae2d',
];

const randColor = arr => arr[Math.floor(Math.random() * arr.length)];

function ProductSingle() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const product = useSelector(selectCurrentProduct);
  const brand = useSelector(s => selectBrandById(s, product.brand));
  const tags = useSelector(selectManyTags(product?.tags || []));
  const images = useSelector(selectManyProductImages(product?.images || []));
  const reviews = useSelector(selectManyReviews(product?.reviews || []));
  const averageRating = useSelector(selectAverageProductRating(product?.reviews || []));
  const [selectedImage, setSelectedImage] = React.useState('');

  React.useEffect(() => {
    setSelectedImage(images[0]?.url || product.imageUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    dispatch(imageGetAllForProduct(product.id));
    dispatch(reviewGetAllForProduct(product.id));
    dispatch(tagGetAllForProduct(product.id));
  }, [dispatch, product.id]);

  return (
    <Container>
      <Grid container spacing={3} style={{ marginTop: '3rem' }}>
        <Grid item xs={6}>
          <div className={classes.gallerySection}>
            <div className={classes.previewBig}>
              <ReactImageMagnify
                {...{
                  imageStyle: {
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  },
                  smallImage: {
                    alt: 'Product big preview',
                    isFluidWidth: true,
                    src: selectedImage,
                  },
                  largeImage: {
                    src: selectedImage,
                    width: 1200,
                    height: 1800,
                  },
                  enlargedImagePosition: 'over',
                }}
              />
            </div>
            <div className={classes.previewList}>
              {images.map(img => (
                <div key={nanoid()} className={classes.imgDiv}>
                  <img
                    className={classes.img}
                    src={img?.url}
                    alt='product small preview'
                    onClick={() => setSelectedImage(img?.url)}
                  />
                </div>
              ))}
            </div>
          </div>
        </Grid>
        <Grid item xs={6}>
          <div className={classes.infoSection}>
            <Typography component='h2' variant='h2'>
              {product.name}
            </Typography>

            <Typography variant='h4'>${product.price}</Typography>

            <div>
              <Rating name='rating' value={averageRating || 0} readOnly />
              <span>{reviews.length === 0 ? 'No reviews' : `(${reviews.length} reviews)`}</span>
              <Button variant='outlined' size='small'>
                Write review
              </Button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Button color='primary' variant='contained'>
                Add to cart
              </Button>

              <div>
                <IconButton>
                  <FavoriteBorderIcon />
                </IconButton>
                <span>Add to whishlist</span>
              </div>
            </div>
          </div>
        </Grid>
      </Grid>

      <div className={classes.details}>
        <Typography variant='h4' className={classes.detailsTitle}>
          Details
        </Typography>
        {Object.entries(product.properties).map(([key, val]) => (
          <Typography key={key} variant='body1' className={classes.detailsText}>
            {key} - {val}
          </Typography>
        ))}

        {tags.map(tag => (
          <Chip key={nanoid()} label={tag?.name} style={{ backgroundColor: randColor(chipColors), color: '#fff' }} />
        ))}
      </div>

      <Grid container spacing={3}>
        <Grid item xs={6}>
          <div className={classes.description}>
            <Typography variant='h4' className={classes.descriptionTitle}>
              Description
            </Typography>
            <Typography variant='body1' className={classes.descriptionText}>
              {product.description}
            </Typography>
          </div>
        </Grid>
        <Grid item xs={6}>
          <div className={classes.brand}>
            <Typography variant='h4' className={classes.brandTitle}>
              About {brand.name} brand
            </Typography>
            <Typography variant='body1' className={classes.brandEmail}>
              email - {brand.email}
            </Typography>
            <Typography variant='body1' className={classes.brandWebsite}>
              website - {brand.websiteUrl}
            </Typography>
            <Typography variant='body1' className={classes.brandDescription}>
              {brand.description}
            </Typography>
          </div>
        </Grid>
      </Grid>

      <div className={classes.reviews}>
        <div>
          <Typography variant='h4' className={classes.reviewsTitle}>
            Reviews <span className={classes.reviewsNum}>({reviews.length})</span>
          </Typography>
        </div>

        <div className={classes.reviewsGrid}>
          {reviews.map(rev => (
            <div key={nanoid()} className={classes.reviewCard}>
              <div className={classes.reviewRating}>
                <Rating name='rating' value={rev?.rating} readOnly />
              </div>
              <Typography variant='h4' className={classes.reviewTitle}>
                {rev?.title}
              </Typography>
              <Typography variant='subtitle2' className={classes.reviewMeta}>
                Posted by bob at 25.5.2020
              </Typography>
              <Typography variant='body1' className={classes.reviewComment}>
                {rev?.comment}
              </Typography>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}

export default ProductSingle;
