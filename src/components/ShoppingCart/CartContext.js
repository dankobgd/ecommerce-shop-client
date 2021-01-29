import React, { createContext } from 'react';

import useLocalStorageReducer from '../../hooks/useLocalStorageReducer';

const initialState = {
  drawerOpen: false,
  items: [],
  promoCode: '',
  promotion: null,
  isPromoCodeError: false,
};

function reducer(state, action) {
  switch (action.type) {
    // sidebar drawer
    case 'DRAWER_OPEN':
      return { ...state, drawerOpen: true };

    case 'DRAWER_CLOSE':
      return { ...state, drawerOpen: false };

    case 'DRAWER_TOGGLE':
      return { ...state, drawerOpen: !state.drawerOpen };

    // cart items
    case 'ADD_PRODUCT': {
      const item = state.items.find(x => x.product.id === action.product.id);
      if (!item) {
        return {
          ...state,
          items: [...state.items, { product: action.product, quantity: action.quantity }],
        };
      }
      return {
        ...state,
        items: state.items.map(x =>
          x.product.id === action.product.id ? { product: x.product, quantity: x.quantity + action.quantity } : x
        ),
      };
    }

    case 'REMOVE_PRODUCT': {
      const item = state.items.find(x => x.product.id === action.id);
      if (item && item.quantity > 1) {
        return {
          ...state,
          items: state.items.map(x =>
            x.product.id === action.id ? { product: x.product, quantity: x.quantity - 1 } : x
          ),
        };
      }
      return {
        ...state,
        items: state.items.filter(x => x.product.id !== action.id),
      };
    }

    case 'CLEAR_PRODUCT':
      return {
        ...state,
        items: state.items.filter(x => x.product.id !== action.id),
      };

    case 'CLEAR_ITEMS':
      return { ...state, items: [] };

    case 'RESET_ALL':
      return { ...initialState };

    // promotion data
    case 'PROMO_CODE_SET':
      return { ...state, promoCode: action.promoCode };

    case 'PROMOTION_SET':
      return { ...state, promotion: action.promotion };

    case 'PROMO_CODE_SET_ERROR':
      return { ...state, isPromoCodeError: action.val };

    default:
      return { ...initialState };
  }
}

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [state, dispatch] = useLocalStorageReducer('cart', reducer, initialState, null, {
    blacklist: ['drawerOpen', 'isPromoCodeError'],
  });

  const cartProducts = React.useMemo(() => state.items.map(x => x.product), [state.items]);

  const totalQuantity = React.useMemo(() => state.items.reduce((total, item) => total + item.quantity, 0), [
    state.items,
  ]);

  const subtotalPrice = React.useMemo(
    () => state.items.reduce((total, item) => total + item.product.price * item.quantity, 0),
    [state.items]
  );

  const totalPrice = React.useMemo(() => {
    let total = 0;

    if (!state.promotion) {
      total = subtotalPrice;
    }

    if (state.promotion?.type === 'percentage') {
      const val = subtotalPrice - (state.promotion?.amount / 100) * subtotalPrice;
      total = Number.parseFloat(val.toFixed(2));
    } else if (state.promotion?.type === 'fixed') {
      const val = subtotalPrice - state.promotion?.amount;
      total = val < 0 ? 0 : val;
    }

    return total;
  }, [state.promotion, subtotalPrice]);

  const selectors = {
    cartProducts,
    totalQuantity,
    subtotalPrice,
    totalPrice,
  };

  const ctxValue = {
    cart: { ...state, ...selectors },
    dispatch,
  };

  return <CartContext.Provider value={ctxValue}>{children}</CartContext.Provider>;
}

// cart side drawer
export const openDrawer = () => ({ type: 'DRAWER_OPEN' });
export const closeDrawer = () => ({ type: 'DRAWER_CLOSE' });
export const toggleDrawer = () => ({ type: 'DRAWER_TOGGLE' });

// cart logic
export const addProduct = (product, quantity = 1) => ({ type: 'ADD_PRODUCT', product, quantity });
export const removeProduct = id => ({ type: 'REMOVE_PRODUCT', id });
export const clearProduct = id => ({ type: 'CLEAR_PRODUCT', id });
export const clearItems = () => ({ type: 'CLEAR_ITEMS' });
export const resetAll = () => ({ type: 'RESET_ALL' });

// promotion data
export const setCartPromoCode = promoCode => ({ type: 'PROMO_CODE_SET', promoCode });
export const setCartPromotion = promotion => ({ type: 'PROMOTION_SET', promotion });
export const setIsPromoCodeError = val => ({ type: 'PROMO_CODE_SET_ERROR', val });
