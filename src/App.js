import React from 'react';

import { CssBaseline } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { LocalizationProvider } from '@material-ui/pickers';
import DateFnsUtils from '@material-ui/pickers/adapter/date-fns';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import AppRoutes from './AppRoutes';
import { CartProvider } from './components/ShoppingCart/CartContext';
import { ToastProvider } from './components/Toast/ToastContext';
import ToastList from './components/Toast/ToastList';
import { ShopProvider } from './screens/Shop/ShopContext';
import theme from './theme/theme';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const queryClientOptions = {
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
    },
  },
};

function App() {
  const queryClient = new QueryClient(queryClientOptions);

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />

      <ToastProvider>
        <CartProvider>
          <ShopProvider>
            <CssBaseline />
            <ToastList />
            <MuiThemeProvider theme={theme}>
              <LocalizationProvider dateAdapter={DateFnsUtils}>
                <DndProvider backend={HTML5Backend}>
                  <AppRoutes />
                </DndProvider>
              </LocalizationProvider>
            </MuiThemeProvider>
          </ShopProvider>
        </CartProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
