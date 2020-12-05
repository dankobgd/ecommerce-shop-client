import React from 'react';

import { camelCase } from 'lodash';

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

export function useFormServerErrors(error, setError) {
  React.useEffect(() => {
    if (error?.statusCode === 422 && error?.code === 'Invalid') {
      const validationErrors = error?.details?.validation?.errors;

      if (validationErrors && validationErrors.length > 0) {
        const formatted = convertErrorsFormat(validationErrors);

        formatted.forEach(err => {
          const { field, message } = err;
          const [, name] = field.split('.');
          const fieldName = name ? camelCase(name) : name;
          const errMsg = message.length === 1 ? message : message.join(', ');
          setError(fieldName, { type: 'server_side', message: errMsg });
        });
      }
    }
  }, [error, setError]);

  return null;
}
