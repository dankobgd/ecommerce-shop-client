import React from 'react';

import { useSelector, useDispatch } from 'react-redux';

import toastSlice, { selectToasts } from '../../store/toast/toastSlice';
import Toast from './Toast';

function ToastList() {
  const dispatch = useDispatch();
  const toastList = useSelector(selectToasts);

  return (
    <div>
      {toastList.map(toast => (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          removeToast={() => dispatch(toastSlice.actions.removeToast(toast.id))}
        />
      ))}
    </div>
  );
}

export default ToastList;
