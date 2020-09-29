import React, { useImperativeHandle } from 'react';

import { useTheme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

function StripeInput(props) {
  const {
    component: Component,
    inputRef,
    /* eslint-disable no-unused-vars */
    'aria-invalid': ariaInvalid,
    'aria-describedby': ariaDescribeBy,
    defaultValue,
    required,
    onKeyDown,
    onKeyUp,
    readOnly,
    autoComplete,
    autoFocus,
    type,
    name,
    rows,
    options,
    /* eslint-enable no-unused-vars */
    ...other
  } = props;
  const theme = useTheme();
  const [mountNode, setMountNode] = React.useState(null);

  useImperativeHandle(
    inputRef,
    () => ({
      focus: () => mountNode.focus(),
    }),
    [mountNode]
  );

  return (
    <Component
      onReady={setMountNode}
      options={{
        ...options,
        hidePostalCode: true,
        style: {
          base: {
            color: theme.palette.text.primary,
            fontSize: `${theme.typography.fontSize}px`,
            fontFamily: theme.typography.fontFamily,
            '::placeholder': {
              color: theme.palette.text.primary,
            },
          },
          invalid: {
            color: theme.palette.text.primary,
          },
        },
      }}
      {...other}
    />
  );
}

export default function StripeTextField(props) {
  const { InputLabelProps, stripeElement, InputProps = {}, inputProps, ...other } = props;

  return (
    <TextField
      fullWidth
      variant='outlined'
      InputLabelProps={{
        ...InputLabelProps,
        shrink: true,
      }}
      InputProps={{
        ...InputProps,
        inputProps: {
          ...inputProps,
          ...InputProps.inputProps,
          component: stripeElement,
        },
        inputComponent: StripeInput,
      }}
      {...other}
    />
  );
}
