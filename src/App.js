import React from 'react';

import { CssBaseline } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { Provider } from 'react-redux';

import AppRoutes from './AppRoutes';
import ToastList from './components/Toast/ToastList';
import store from './store/store';
import { getCurrentUser } from './store/user/userSlice';
import theme from './theme/theme';

function App() {
  React.useEffect(() => {
    store.dispatch(getCurrentUser());
  }, []);

  return (
    <Provider store={store}>
      <CssBaseline />
      <ToastList />
      <MuiThemeProvider theme={theme}>
        <AppRoutes />
      </MuiThemeProvider>
    </Provider>
  );
}

export default App;
