import React from 'react';

import { CssBaseline } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { LocalizationProvider } from '@material-ui/pickers';
import DateFnsUtils from '@material-ui/pickers/adapter/date-fns';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { QueryCache, ReactQueryCacheProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query-devtools';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import AppRoutes from './AppRoutes';
import ToastList from './components/Toast/ToastList';
import { store, persistor } from './store/store';
import { ToastProvider } from './store/toast/toast';
import { getCurrentUser } from './store/user/userSlice';
import theme from './theme/theme';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function App() {
  React.useEffect(() => {
    store.dispatch(getCurrentUser());
  }, []);

  const queryCache = new QueryCache();

  return (
    <ReactQueryCacheProvider queryCache={queryCache}>
      <ReactQueryDevtools initialIsOpen />

      <ToastProvider>
        <Provider store={store}>
          <PersistGate persistor={persistor} loading={<div>Loading...</div>}>
            <CssBaseline />
            <ToastList />
            <MuiThemeProvider theme={theme}>
              <LocalizationProvider dateAdapter={DateFnsUtils}>
                <DndProvider backend={HTML5Backend}>
                  <AppRoutes />
                </DndProvider>
              </LocalizationProvider>
            </MuiThemeProvider>
          </PersistGate>
        </Provider>
      </ToastProvider>
    </ReactQueryCacheProvider>
  );
}

export default App;
