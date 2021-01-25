import React, { useState, createContext } from 'react';

import { usePersistedState } from '../../hooks/usePersistedState';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [items, setItems] = usePersistedState('items', []);
  const [cartPromoCode, setCartPromoCode] = usePersistedState('cartPromoCode', '');
  const [cartPromotion, setCartPromotion] = usePersistedState('cartPromotion', null);

  const openDrawer = () => {
    setDrawerOpen(true);
  };
  const closeDrawer = () => {
    setDrawerOpen(false);
  };
  const toggleDrawer = () => {
    setDrawerOpen(prev => !prev);
  };

  const addProduct = (product, quantity = 1) => {
    const item = items.find(x => x.product.id === product.id);
    if (!item) {
      setItems(old => [...old, { product, quantity }]);
    } else {
      setItems(old =>
        old.map(x => (x.product.id === product.id ? { product: x.product, quantity: x.quantity + quantity } : x))
      );
    }
  };

  const removeProduct = id => {
    const item = items.find(x => x.product.id === id);
    if (item && item.quantity > 1) {
      setItems(old => old.map(x => (x.product.id === id ? { product: x.product, quantity: x.quantity - 1 } : x)));
    } else {
      setItems(old => old.filter(x => x.product.id !== id));
    }
  };

  const clearProduct = id => {
    setItems(old => old.filter(x => x.product.id !== id));
  };

  const clearItems = () => {
    setItems([]);
  };

  const resetAll = () => {
    clearItems();
    setCartPromoCode('');
    setCartPromotion(null);
  };

  const cartProducts = React.useMemo(() => items.map(x => x.product), [items]);

  const totalQuantity = React.useMemo(() => items.reduce((total, item) => total + item.quantity, 0), [items]);

  const subtotalPrice = React.useMemo(
    () => items.reduce((total, item) => total + item.product.price * item.quantity, 0),
    [items]
  );

  const totalPrice = React.useMemo(() => {
    let total = 0;

    if (!cartPromotion) {
      total = subtotalPrice;
    }

    if (cartPromotion?.type === 'percentage') {
      const val = subtotalPrice - (cartPromotion?.amount / 100) * subtotalPrice;
      total = Number.parseFloat(val.toFixed(2));
    } else if (cartPromotion?.type === 'fixed') {
      const val = subtotalPrice - cartPromotion?.amount;
      total = val < 0 ? 0 : val;
    }

    return total;
  }, [cartPromotion, subtotalPrice]);

  return (
    <CartContext.Provider
      value={{
        drawerOpen,
        subtotalPrice,
        totalPrice,
        totalQuantity,
        items,
        openDrawer,
        closeDrawer,
        toggleDrawer,
        addProduct,
        removeProduct,
        clearProduct,
        clearItems,
        cartProducts,
        cartPromoCode,
        setCartPromoCode,
        cartPromotion,
        setCartPromotion,
        resetAll,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
