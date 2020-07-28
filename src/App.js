import React from 'react';
import { Provider } from 'react-redux';
import { CssBaseline } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';

import { getCurrentUser } from './store/user/userSlice';
import ToastList from './components/Toast/ToastList';
import AppRoutes from './AppRoutes';
import theme from './theme/theme';
import store from './store/store';

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
