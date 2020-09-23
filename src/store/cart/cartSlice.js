import { createSelector, createSlice } from '@reduxjs/toolkit';

export const sliceName = 'cart';

const initialState = {
  items: [],
  drawerOpen: false,
};

const cartSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    toggleDrawerOpen: state => {
      state.drawerOpen = true;
    },
    toggleDrawerClose: state => {
      state.drawerOpen = false;
    },
    toggleDrawer: state => {
      state.drawerOpen = !state.drawerOpen;
    },
    addProductToCart: (state, { payload }) => {
      const item = state.items.find(x => x.product.id === payload.id);

      if (!item) {
        state.items.push({ product: payload, quantity: 1 });
      } else {
        item.quantity += 1;
      }
    },
    removeProductFromCart: (state, { payload }) => {
      const item = state.items.find(x => x.product.id === payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      } else {
        const idx = state.items.findIndex(x => x.product.id === payload);
        state.items.splice(idx, 1);
      }
    },
    clearProductFromCart: (state, { payload }) => {
      const idx = state.items.findIndex(x => x.product.id === payload);
      state.items.splice(idx, 1);
    },
    clearCartItems: (state, { payload }) => {
      state.items = [];
    },
  },
});

export const selectCartItems = state => state[sliceName].items;
export const selectDrawerOpen = state => state[sliceName].drawerOpen;
export const selectCartLength = createSelector(selectCartItems, items => items?.length);
export const selectCartTotalPrice = createSelector(selectCartItems, items =>
  // eslint-disable-next-line
  items.reduce((total, item) => total + item.product.price * item.quantity, 0)
);
export const selectCartTotalQuantity = createSelector(selectCartItems, items =>
  // eslint-disable-next-line
  items.reduce((total, item) => total + item.quantity, 0)
);
export const selectCartProducts = createSelector(selectCartItems, items => items.map(x => x.product));

export default cartSlice;
