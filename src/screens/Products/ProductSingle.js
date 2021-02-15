/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useContext, useState } from 'react';

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
  Select,
  FormControl,
  InputLabel,
  MenuItem,
} from '@material-ui/core';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import { Rating } from '@material-ui/lab';
import { nanoid } from 'nanoid';
import { FormProvider, useForm } from 'react-hook-form';
import ReactImageMagnify from 'react-image-magnify';
import * as Yup from 'yup';

import CustomTooltip from '../../components/CustomTooltip/CustomTooltip';
import { StandaloneDiscountBadge } from '../../components/DiscountBadge/DiscountBadge';
import { FormSubmitButton, FormTextField, FormRating } from '../../components/Form';
import ErrorMessage from '../../components/Message/ErrorMessage';
import { addProduct, CartContext } from '../../components/ShoppingCart/CartContext';
import DeleteDialog from '../../components/TableComponents/DeleteDialog';
import { ToastContext } from '../../components/Toast/ToastContext';
import {
  useProduct,
  useProductImages,
  useProductReviews,
  useProductTags,
  useCreateProductReview,
  useDeleteProductReview,
  useUpdateProductReview,
} from '../../hooks/queries/productQueries';
import {
  useAddProductToWishlist,
  useDeleteProductFromWishlist,
  useUserFromCache,
  useWishlist,
} from '../../hooks/queries/userQueries';
import { useFormServerErrors } from '../../hooks/useFormServerErrors';
import { useIsAuthenticated } from '../../hooks/useIsAuthenticated';
import { diff, isEmptyObject } from '../../utils/diff';
import { formatPriceForDisplay } from '../../utils/priceFormat';
import { rules } from '../../utils/validation';

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
    display: 'flex',
    justifyContent: 'flex-start',
    width: '100%',
  },

  imgDiv: {
    width: '100px',
    height: '60px',
    marginRight: '1rem',
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

  ratingSection: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 10,
  },
  pricesSection: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'first baseline',
    width: '100%',
    marginTop: '1rem',
  },
  pricesGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  originalPriceWrapper: {
    display: 'flex',
  },
  originalPriceText: {
    color: 'rgba(0, 0, 0, 0.4)',
    marginRight: 10,
  },
  originalPrice: {
    position: 'relative',
    color: 'rgba(0, 0, 0, 0.4)',

    '&:before': {
      position: 'absolute',
      content: '""',
      left: 0,
      top: '50%',
      right: 0,
      borderTop: '2px solid',
      borderColor: 'red',
      transform: 'rotate(-7deg) scale(1.2)',
    },
  },
  priceWrapper: {
    display: 'flex',
    marginTop: '1rem',
  },
  priceText: {
    marginRight: 10,
  },
  price: {},

  addToCartSection: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '3rem',
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
    position: 'relative',
  },
  reviewEditBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  reviewDeleteBtn: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    color: 'red',
    fill: 'red',
  },
  reviewRating: {},
  reviewTitle: {},
  reviewMeta: {},
  reviewComment: {
    marginTop: '8px',
  },
  wishlistRemove: {
    marginLeft: '1rem',
  },
  wishlistAdd: {
    marginLeft: '1rem',
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
  rating: rules.requiredPositiveNumber,
  title: Yup.string().required(),
  comment: Yup.string().required(),
});

const formOpts1 = {
  mode: 'onChange',
  reValidateMode: 'onChange',
  resolver: yupResolver(schema),
  defaultValues: {
    rating: '',
    title: '',
    comment: '',
  },
};

const formOpts2 = {
  mode: 'onChange',
  reValidateMode: 'onChange',
  resolver: yupResolver(schema),
  defaultValues: {
    rating: '',
    title: '',
    comment: '',
  },
};

export function formatSaleEndDate(date) {
  if (!date) return '';

  const d = date instanceof Date ? date : new Date(date);

  const dtf = new Intl.DateTimeFormat('sr-RS', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  });

  return dtf.format(d);
}

function ProductSingle({ productId }) {
  const classes = useStyles();
  const toast = useContext(ToastContext);
  const { dispatch } = useContext(CartContext);

  const [userReview, setUserReview] = useState(null);
  const [deleteItem, setDeleteItem] = useState();
  const [baseFormObj, setBaseFormObj] = React.useState({});
  const [selectedImage, setSelectedImage] = useState('');
  const [randomChipColors, setRandomChipColors] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [reviewDeleteDialogOpen, setReviewDeleteDialogOpen] = useState(false);
  const [qty, setQty] = React.useState(1);

  const user = useUserFromCache();
  const isAuthenticated = useIsAuthenticated();
  const { data: product } = useProduct(productId);
  const { data: productTags } = useProductTags(productId);
  const { data: productReviews } = useProductReviews(productId);
  const { data: productImages } = useProductImages(productId, {
    onSuccess: result => setSelectedImage(result?.[0]?.url || product?.imageUrl),
  });
  const { data: userWishlist } = useWishlist({ enabled: isAuthenticated });

  const handleChange = event => {
    setQty(event.target.value);
  };

  const handleDeleteReviewDialogOpen = review => {
    setReviewDeleteDialogOpen(true);
    setDeleteItem(review);
  };
  const handleDeleteReviewDialogClose = () => {
    setReviewDeleteDialogOpen(false);
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };
  const handleModalClose = () => {
    setModalOpen(false);
  };

  const isOwnReview = rev => rev.userId === user?.id;

  const hasDiscountPrice = product?.price < product?.originalPrice;

  const averageRating =
    productReviews?.length > 0 ? productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length : null;

  const isProductWishlisted = userWishlist?.some(x => x.id === Number(productId));

  const createReviewMutation = useCreateProductReview(productId, {
    onSuccess: () => handleModalClose(),
  });
  const editProductReviewMutation = useUpdateProductReview(productId, userReview?.id, {
    onSuccess: () => handleModalClose(),
  });

  const deleteProductReviewMutation = useDeleteProductReview({
    onSuccess: () => {
      setUserReview(null);
    },
  });

  const addToWishlistMutation = useAddProductToWishlist();
  const removeFromWishlistMutation = useDeleteProductFromWishlist();

  const methods1 = useForm(formOpts1);
  const methods2 = useForm(formOpts2);

  const { handleSubmit: handleSubmitCreateReview, setError: setErrorCreateReview } = methods1;
  const { handleSubmit: handleSubmitEditReview, setError: setErrorEditReview, reset } = methods2;

  const onSubmitCreateReview = values => {
    createReviewMutation.mutate(values);
  };

  const onSubmitEditReview = values => {
    const changes = diff(baseFormObj, values);

    if (isEmptyObject(changes)) {
      toast.info('No changes applied');
    }
    if (!isEmptyObject(changes)) {
      editProductReviewMutation.mutate(changes);
    }
  };

  const onError = () => {
    toast.error('Form has errors, please check the details');
  };

  React.useEffect(() => {
    const colors = productTags?.map(() => randColor(chipColors));
    setRandomChipColors(colors);
  }, [productTags]);

  React.useEffect(() => {
    const rev = productReviews?.find(review => review.userId === user?.id);

    if (rev) {
      setUserReview(rev);
      setBaseFormObj(rev);
      reset(rev);
    }
  }, [productReviews, reset, user]);

  useFormServerErrors(createReviewMutation?.error, setErrorCreateReview);
  useFormServerErrors(editProductReviewMutation?.error, setErrorEditReview);

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
                {productImages?.map(img => (
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

              <div className={classes.ratingSection}>
                <Rating name='rating' precision={0.5} value={averageRating || 0} readOnly />
                <span className={classes.ratingText}>
                  {productReviews?.length === 0 ? '(No reviews)' : `(${productReviews?.length} reviews)`}
                </span>

                {isProductWishlisted ? (
                  <CustomTooltip title={<Typography color='inherit'>Remove from wishlist</Typography>}>
                    <IconButton
                      className={classes.wishlistRemove}
                      onClick={() => removeFromWishlistMutation.mutate(product?.id)}
                    >
                      <FavoriteIcon style={{ color: 'red', fontSize: 32 }} />
                    </IconButton>
                  </CustomTooltip>
                ) : (
                  <CustomTooltip title={<Typography color='inherit'>Add to wishlist</Typography>}>
                    <IconButton
                      className={classes.wishlistAdd}
                      onClick={() => addToWishlistMutation.mutate({ productId: product?.id })}
                    >
                      <FavoriteBorderIcon style={{ color: 'red', fontSize: 32 }} />
                    </IconButton>
                  </CustomTooltip>
                )}
              </div>

              <div className={classes.pricesSection}>
                <div className={classes.pricesGroup}>
                  {hasDiscountPrice && (
                    <div>
                      <div className={classes.originalPriceWrapper}>
                        <Typography variant='h4' className={classes.originalPriceText}>
                          Old Price:
                        </Typography>

                        <Typography variant='h4'>
                          <span className={classes.originalPrice}>
                            ${product && formatPriceForDisplay(product.originalPrice)}
                          </span>
                        </Typography>
                      </div>
                    </div>
                  )}
                  <div>
                    <div className={classes.priceWrapper}>
                      <Typography variant='h4' className={classes.priceText}>
                        {hasDiscountPrice ? `Discount Price:` : `Price:`}
                      </Typography>

                      <Typography variant='h3' className={classes.price}>
                        ${product && formatPriceForDisplay(product.price)}
                      </Typography>
                    </div>

                    {hasDiscountPrice && (
                      <Typography
                        variant='subtitle1'
                        style={{ color: 'orange', marginTop: '2rem', fontSize: '1.2rem' }}
                      >
                        Sale ends at {formatSaleEndDate(product?.saleEnds)}
                      </Typography>
                    )}
                  </div>
                </div>

                {hasDiscountPrice && <StandaloneDiscountBadge product={product} />}
              </div>

              <div className={classes.addToCartSection}>
                <Button
                  startIcon={<AddShoppingCartIcon />}
                  color='primary'
                  variant='contained'
                  onClick={() => {
                    dispatch(addProduct(product, qty));
                    toast.success('Product added to cart');
                  }}
                >
                  Add to cart
                </Button>

                <FormControl
                  variant='outlined'
                  className={classes.formControl}
                  size='small'
                  style={{ marginLeft: '1rem' }}
                >
                  <InputLabel id='cart-items-number'>Quantity</InputLabel>
                  <Select labelId='cart-items-number' value={qty} onChange={handleChange} label='Quantity'>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 25, 50, 100]
                      .map(n => ({ value: n, label: n }))
                      .map(x => (
                        <MenuItem key={x.value} value={x.value}>
                          {x.label}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </div>
            </div>
          </Grid>
        </Grid>

        <div className={classes.details}>
          <Typography variant='h4' className={classes.detailsTitle}>
            Details
          </Typography>
          {product?.properties &&
            Object.entries(product.properties).map(([key, val]) => (
              <Typography key={key} variant='body1' className={classes.detailsText}>
                {key} - {val}
              </Typography>
            ))}

          {productTags?.map((tag, idx) => (
            <Chip
              key={nanoid()}
              label={tag?.name}
              style={{ backgroundColor: randomChipColors?.[idx] || '#333', color: '#fff' }}
            />
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
                About {product?.brand?.name} brand
              </Typography>
              <Typography variant='body1' className={classes.brandEmail}>
                email - {product?.brand?.email}
              </Typography>
              <Typography variant='body1' className={classes.brandWebsite}>
                website - {product?.brand?.websiteUrl}
              </Typography>
              <Typography variant='body1' className={classes.brandDescription}>
                {product?.brand?.description}
              </Typography>
            </div>
          </Grid>
        </Grid>

        <div className={classes.reviews}>
          {!userReview && (
            <div style={{ marginBottom: '1rem' }}>
              <Button variant='outlined' color='primary' size='small' onClick={handleModalOpen}>
                Post review
              </Button>
            </div>
          )}

          <div>
            <Typography variant='h4' className={classes.reviewsTitle}>
              Reviews <span className={classes.reviewsNum}>({productReviews?.length})</span>
            </Typography>
          </div>

          <div className={classes.reviewsGrid}>
            {productReviews?.length > 0 &&
              productReviews?.map(rev => (
                <div key={nanoid()} className={classes.reviewCard}>
                  {isOwnReview(rev) && (
                    <CustomTooltip title={<Typography color='inherit'>Edit Review</Typography>}>
                      <IconButton
                        className={classes.reviewEditBtn}
                        color='primary'
                        onClick={() => {
                          handleModalOpen();
                          setUserReview(rev);
                          reset(rev);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </CustomTooltip>
                  )}

                  {isOwnReview(rev) && (
                    <CustomTooltip title={<Typography color='inherit'>Delete Review</Typography>}>
                      <IconButton className={classes.reviewDeleteBtn} onClick={() => handleDeleteReviewDialogOpen(rev)}>
                        <DeleteIcon />
                      </IconButton>
                    </CustomTooltip>
                  )}

                  <div className={classes.reviewRating}>
                    <Rating name='rating' value={rev?.rating} readOnly />
                  </div>
                  <Typography variant='h4' className={classes.reviewTitle}>
                    {rev?.title}
                  </Typography>
                  <Typography variant='subtitle2' className={classes.reviewMeta}>
                    {rev?.user?.username} @{rev.createdAt}
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
              <form onSubmit={handleSubmitEditReview(onSubmitEditReview, onError)} noValidate>
                {editProductReviewMutation?.isLoading && <CircularProgress />}
                {editProductReviewMutation?.isError && (
                  <ErrorMessage message={editProductReviewMutation.error.message} />
                )}

                <span>rating: </span>
                <FormRating name='rating' />
                <FormTextField name='title' fullWidth />
                <FormTextField name='comment' multiline fullWidth rows={5} />

                <Button onClick={handleModalClose} color='primary'>
                  Cancel
                </Button>
                <FormSubmitButton loading={editProductReviewMutation?.isLoading}>Update Review</FormSubmitButton>
              </form>
            </FormProvider>
          ) : (
            <FormProvider {...methods1}>
              <form onSubmit={handleSubmitCreateReview(onSubmitCreateReview, onError)} noValidate>
                {createReviewMutation?.isLoading && <CircularProgress />}
                {createReviewMutation?.isError && <ErrorMessage message={createReviewMutation.error.message} />}

                <span>rating: </span>
                <FormRating name='rating' />
                <FormTextField name='title' fullWidth />
                <FormTextField name='comment' multiline fullWidth rows={5} />

                <Button onClick={handleModalClose} color='primary'>
                  Cancel
                </Button>
                <FormSubmitButton loading={createReviewMutation?.isLoading}>Post Review</FormSubmitButton>
              </form>
            </FormProvider>
          )}
        </DialogContent>
      </Dialog>

      <DeleteDialog
        title='review'
        handleDialogClose={handleDeleteReviewDialogClose}
        dialogOpen={reviewDeleteDialogOpen}
        onClick={() => {
          handleDeleteReviewDialogClose();
          deleteProductReviewMutation.mutate({ productId, reviewId: deleteItem.id });
        }}
      />
    </>
  );
}

export default ProductSingle;
