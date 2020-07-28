import React from 'react';
import userSlice from '../store/user/userSlice';

// because same key can appear multiple times
// it converts from [{field: '', message: ''}] to [{field: '', message: []}]
function convertErrorsFormat(arr) {
  const map = new Map();

  arr.forEach(({ field: k, message: v }) => {
    const values = map.get(k) || [];
    values.push(v);
    map.set(k, values);
  });

  return [...map.entries()].map(([k, v]) => ({ field: k, message: v }));
}

export function useFormServerErrors(error, setError, clearErrors, dispatch) {
  React.useEffect(() => {
    if (error?.statusCode === 422 && error?.code === 'Invalid') {
      const validationErrors = error?.details?.validation?.errors;

      if (validationErrors && validationErrors.length > 0) {
        const formatted = convertErrorsFormat(validationErrors);

        formatted.forEach(err => {
          const { field, message } = err;
          const errMsg = message.length === 1 ? message : message.join(', ');
          setError(field, { type: 'server_side', message: errMsg });
        });
      }
    }
  }, [error, setError]);

  React.useEffect(
    () => () => {
      clearErrors();
      dispatch(userSlice.actions.clearErrors());
    },
    [clearErrors, dispatch]
  );

  return null;
}
