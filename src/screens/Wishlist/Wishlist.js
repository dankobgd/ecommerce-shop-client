import React from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  makeStyles,
  Typography,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

import ProductCard from '../../components/ProductCard/ProductCard';
import { useClearWishlist, useWishlist } from '../../hooks/queries/userQueries';

const useStyles = makeStyles(() => ({
  upDiv: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '1rem',
    marginBottom: '2rem',
  },
  outer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'space-between',
    padding: '1rem',
  },
  productArea: {
    display: 'grid',
    justifyItems: 'space-between',
    alignItems: 'flex-start',
    gridTemplateColumns: 'repeat(auto-fill,minmax(280px, 1fr))',
    gridGap: '1rem',
  },
}));

function Wishlist() {
  const classes = useStyles();

  const { data: productWishlist } = useWishlist();

  const clearWishlistMutation = useClearWishlist();

  const [open, setOpen] = React.useState(false);
  const handleClear = () => {
    setOpen(false);
    clearWishlistMutation.mutate();
  };

  return (
    <>
      <div className={classes.outer}>
        <div className={classes.upDiv}>
          <Typography variant='h4'>Products Wishlist</Typography>
          {productWishlist?.length > 0 && (
            <Button
              size='small'
              variant='outlined'
              startIcon={<DeleteIcon color='error' />}
              style={{ marginRight: 'auto', marginTop: '1rem' }}
              onClick={() => {
                setOpen(true);
              }}
            >
              Clear wishlist
            </Button>
          )}
        </div>

        <div className={classes.productArea}>
          {productWishlist?.map(product => (
            <ProductCard key={product.sku} product={product} />
          ))}
          {productWishlist?.length === 0 && (
            <div style={{ padding: '2rem' }}>
              <Typography variant='h4'>No products in wishlist</Typography>
            </div>
          )}
        </div>
      </div>

      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        aria-labelledby='clear-wishlist'
        aria-describedby='clear-wishlist'
      >
        <DialogTitle id='clear-wishlist'>Clear Wishlist</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Are you sure you want to remove all products from wishlist?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
            }}
            color='primary'
          >
            Cancel
          </Button>
          <Button onClick={handleClear} color='primary' autoFocus>
            Clear All
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
export default Wishlist;
