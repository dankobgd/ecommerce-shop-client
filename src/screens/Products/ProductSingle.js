/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState } from 'react';

import { yupResolver } from '@hookform/resolvers';
import {
  Button,
  Chip,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  makeStyles,
  Typography,
  CircularProgress,
} from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import { Rating } from '@material-ui/lab';
import { nanoid } from 'nanoid';
import { FormProvider, useForm } from 'react-hook-form';
import ReactImageMagnify from 'react-image-magnify';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

import { FormSubmitButton, FormTextField, FormRating } from '../../components/Form';
import ErrorMessage from '../../components/Message/ErrorMessage';
import { useFormServerErrors } from '../../hooks/useFormServerErrors';
import { selectCurrentProductBrand } from '../../store/brand/brandSlice';
import { selectCurrentProduct, selectCurrentId, productGet } from '../../store/product/productSlice';
import { imageGetAllForProduct, selectCurrentProductImages } from '../../store/product_image/productImageSlice';
import {
  reviewGetAllForProduct,
  selectAverageProductRating,
  selectUserReview,
  reviewCreate,
  reviewUpdate,
  selectCurrentProductReviews,
} from '../../store/review/reviewSlice';
import { tagGetAllForProduct, selectCurrentProductTags } from '../../store/tag/tagSlice';
import { selectUIState } from '../../store/ui';
import {
  selectUserProfile,
  selectWishlistProductIds,
  wishlistAddProduct,
  wishlistDeleteProduct,
} from '../../store/user/userSlice';

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

const schema = Yup.object({
  rating: Yup.number().required().moreThan(0),
  title: Yup.string().required(),
  comment: Yup.string().required(),
});

const formOpts1 = {
  mode: 'onChange',
  reValidateMode: 'onChange',
  resolver: yupResolver(schema),
  defaultValues: {
    rating: 0,
    title: '',
    comment: '',
  },
};

const formOpts2 = rev => ({
  mode: 'onChange',
  reValidateMode: 'onChange',
  resolver: yupResolver(schema),
  defaultValues: {
    rating: rev?.rating || 0,
    title: rev?.title || '',
    comment: rev?.comment || '',
  },
});

function ProductSingle() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const pid = useSelector(selectCurrentId);
  const brand = useSelector(selectCurrentProductBrand);
  const tags = useSelector(selectCurrentProductTags);
  const images = useSelector(selectCurrentProductImages);
  const reviews = useSelector(selectCurrentProductReviews);
  const userReview = useSelector(selectUserReview);
  const user = useSelector(selectUserProfile);
  const product = useSelector(selectCurrentProduct);
  const averageRating = useSelector(selectAverageProductRating);
  const wishlistIds = useSelector(selectWishlistProductIds);
  const [selectedImage, setSelectedImage] = useState('');
  const [randomChipColors, setRandomChipColors] = useState([]);

  React.useEffect(() => {
    setSelectedImage(images[0]?.url || product?.imageUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  React.useEffect(() => {
    const colors = tags.map(() => randColor(chipColors));
    setRandomChipColors(colors);
  }, [tags]);

  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = () => {
    setModalOpen(true);
  };
  const handleModalClose = () => {
    setModalOpen(false);
  };

  React.useEffect(() => {
    dispatch(productGet(pid));
    dispatch(reviewGetAllForProduct(pid));
    dispatch(tagGetAllForProduct(pid));
    dispatch(imageGetAllForProduct(pid));
  }, [dispatch, pid]);

  const methods1 = useForm(formOpts1);
  const { handleSubmit: handleSubmitCreateReview, setError: setErrorCreateReview } = methods1;
  const { loading: loadingCreateReview, error: errorCreateReview } = useSelector(selectUIState(reviewCreate));
  const onSubmitCreateReview = async data => {
    const payload = { userId: user.id, productId: pid, ...data };
    await dispatch(reviewCreate(payload));
  };

  const methods2 = useForm(formOpts2(userReview));
  const { handleSubmit: handleSubmitEditReview, setError: setErrorEditReview, reset } = methods2;
  const { loading: loadingEditReview, error: errorEditReview } = useSelector(selectUIState(reviewCreate));
  const onSubmitEditReview = async data => {
    const payload = { productId: pid, ...data };
    await dispatch(reviewUpdate({ id: userReview.id, details: payload }));
  };

  React.useEffect(() => {
    reset({
      rating: userReview?.rating || 0,
      title: userReview?.title || '',
      comment: userReview?.comment || '',
    });
  }, [reset, userReview]);

  useFormServerErrors(errorCreateReview, setErrorCreateReview);
  useFormServerErrors(errorEditReview, setErrorEditReview);

  return (
    <>
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
                      src: selectedImage || '',
                    },
                    largeImage: {
                      src: selectedImage || '',
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
                {product?.name}
              </Typography>

              <Typography variant='h4'>${product?.price}</Typography>

              <div>
                <Rating name='rating' precision={0.5} value={averageRating || 0} readOnly />
                <span>{reviews.length === 0 ? 'No reviews' : `(${reviews.length} reviews)`}</span>
                <Button variant='outlined' size='small' onClick={handleModalOpen}>
                  {userReview ? 'Edit review' : 'Post review'}
                </Button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Button color='primary' variant='contained'>
                  Add to cart
                </Button>

                {wishlistIds.includes(pid) ? (
                  <div>
                    <IconButton onClick={() => dispatch(wishlistDeleteProduct({ productId: pid }))}>
                      <FavoriteIcon style={{ color: 'red' }} />
                    </IconButton>
                    <span>Remove from wishlist</span>
                  </div>
                ) : (
                  <div>
                    <IconButton onClick={() => dispatch(wishlistAddProduct({ productId: pid }))}>
                      <FavoriteBorderIcon style={{ color: 'red' }} />
                    </IconButton>
                    <span>Add to wishlist</span>
                  </div>
                )}
              </div>
            </div>
          </Grid>
        </Grid>

        <div className={classes.details}>
          <Typography variant='h4' className={classes.detailsTitle}>
            Details
          </Typography>
          {product &&
            Object.entries(product.properties).map(([key, val]) => (
              <Typography key={key} variant='body1' className={classes.detailsText}>
                {key} - {val}
              </Typography>
            ))}

          {tags.map((tag, idx) => (
            <Chip key={nanoid()} label={tag?.name} style={{ backgroundColor: randomChipColors[idx], color: '#fff' }} />
          ))}
        </div>

        <Grid container spacing={3}>
          <Grid item xs={6}>
            <div className={classes.description}>
              <Typography variant='h4' className={classes.descriptionTitle}>
                Description
              </Typography>
              <Typography variant='body1' className={classes.descriptionText}>
                {product?.description}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={6}>
            <div className={classes.brand}>
              <Typography variant='h4' className={classes.brandTitle}>
                About {brand?.name} brand
              </Typography>
              <Typography variant='body1' className={classes.brandEmail}>
                email - {brand?.email}
              </Typography>
              <Typography variant='body1' className={classes.brandWebsite}>
                website - {brand?.websiteUrl}
              </Typography>
              <Typography variant='body1' className={classes.brandDescription}>
                {brand?.description}
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
            {reviews.length > 0 &&
              reviews.map(rev => (
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

      <Dialog
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby={`${userReview ? 'edit' : 'create'}-review-dialog`}
      >
        <DialogTitle>{userReview ? 'Edit' : 'Create'} Product Review</DialogTitle>
        <DialogContent>
          {userReview ? (
            <FormProvider {...methods2}>
              <form onSubmit={handleSubmitEditReview(onSubmitEditReview)} noValidate>
                {loadingEditReview && <CircularProgress />}
                {errorEditReview && <ErrorMessage message={errorEditReview.message} />}

                <span>rating: </span>
                <FormRating name='rating' />
                <FormTextField name='title' fullWidth />
                <FormTextField name='comment' multiline fullWidth />

                <Button onClick={handleModalClose} color='primary'>
                  Cancel
                </Button>
                <FormSubmitButton>Update Review</FormSubmitButton>
              </form>
            </FormProvider>
          ) : (
            <FormProvider {...methods1}>
              <form onSubmit={handleSubmitCreateReview(onSubmitCreateReview)} noValidate>
                {loadingCreateReview && <CircularProgress />}
                {errorCreateReview && <ErrorMessage message={errorCreateReview.message} />}

                <span>rating: </span>
                <FormRating name='rating' />
                <FormTextField name='title' fullWidth />
                <FormTextField name='comment' multiline fullWidth />

                <Button onClick={handleModalClose} color='primary'>
                  Cancel
                </Button>
                <FormSubmitButton>Post Review</FormSubmitButton>
              </form>
            </FormProvider>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ProductSingle;
