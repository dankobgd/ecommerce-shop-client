import React from 'react';

import { CssBaseline } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import AppRoutes from './AppRoutes';
import ToastList from './components/Toast/ToastList';
import { store, persistor } from './store/store';
import { getCurrentUser } from './store/user/userSlice';
import theme from './theme/theme';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function App() {
  React.useEffect(() => {
    store.dispatch(getCurrentUser());
  }, []);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={<div>Loading...</div>}>
        <CssBaseline />
        <ToastList />
        <MuiThemeProvider theme={theme}>
          <AppRoutes />
        </MuiThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
