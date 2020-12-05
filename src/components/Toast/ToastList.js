import React, { useContext } from 'react';

import { ToastContext } from '../../store/toast/toast';
import Toast from './Toast';

function ToastList() {
  const toastCtx = useContext(ToastContext);

  return (
    <div>
      {toastCtx.toasts.map(toast => (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          removeToast={() => toastCtx.removeToast(toast.id)}
        />
      ))}
    </div>
  );
}

export default ToastList;
