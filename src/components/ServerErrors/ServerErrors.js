import React from 'react';

// because same key can appear multiple times
// this -> [{field: 'password', message: 'min 5'}, {field: 'password', message: 'max 50'}, {field: 'password', message: 'required'}]
// becomes ->  [{field: 'password', message: ['min 5', 'max 50', 'required']}]
function convertErrorsFormat(arr) {
  const map = new Map();

  arr.forEach(({ field: k, message: v }) => {
    const values = map.get(k) || [];
    values.push(v);
    map.set(k, values);
  });

  return [...map.entries()].map(([k, v]) => ({ field: k, message: v }));
}

export default function ServerError({ error, setErrors }) {
  React.useEffect(() => {
    if (error?.statusCode === 422 && error?.code === 'Invalid') {
      const validationErrors = error?.details?.validation?.errors;

      if (validationErrors && validationErrors.length > 0) {
        const formatted = convertErrorsFormat(validationErrors);
        const errorsObj = {};
        formatted.forEach(({ field, message }) => {
          const errMsg = message.length === 1 ? message : message.join(', ');
          errorsObj[field] = errMsg;
        });
        setErrors(errorsObj);
      }
    }
  }, [error, setErrors]);

  return null;
}
