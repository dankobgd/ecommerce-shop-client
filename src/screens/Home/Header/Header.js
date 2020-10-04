import React from 'react';

import { Badge, makeStyles, Popover, Typography } from '@material-ui/core';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCartOutlined';
import { useDispatch, useSelector } from 'react-redux';

import ShoppingCart from '../../../components/ShoppingCart/ShoppingCart';
import cartSlice, { selectCartLength, selectCartTotalQuantity } from '../../../store/cart/cartSlice';
import Search from './Search';

const useStyles = makeStyles(theme => ({
  headerOuter: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchOuter: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInner: {
    width: '100%',
    padding: '2rem 5rem',
    maxWidth: '640px',
  },

  subHeader: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: '2rem',
    width: '100%',
  },
  cartIcon: {
    fontSize: 40,
    cursor: 'pointer',
  },

  popoverText: {
    padding: theme.spacing(2),
  },
}));

function Header() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const cartLength = useSelector(selectCartLength);
  const cartTotalQuantity = useSelector(selectCartTotalQuantity);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const id = anchorEl ? 'simple-popover' : undefined;

  const handleDrawer = event => {
    if (!cartLength || cartLength === 0) {
      setAnchorEl(event.currentTarget);
    } else if (cartLength > 0) {
      dispatch(cartSlice.actions.toggleDrawerOpen());
    }
  };

  return (
    <>
      <Popover
        id={id}
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Typography className={classes.popoverText}>Shopping cart is empty</Typography>
      </Popover>

      <ShoppingCart />

      <div className={classes.headerOuter}>
        <div className={classes.subHeader}>
          <Badge badgeContent={cartTotalQuantity} color='primary' onClick={handleDrawer}>
            <ShoppingCartIcon className={classes.cartIcon} />
          </Badge>
        </div>
        <div className={classes.searchOuter}>
          <div className={classes.searchInner}>
            <Search />
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
