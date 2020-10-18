import React from 'react';

import { TextField } from '@material-ui/core';
import NumberFormat from 'react-number-format';

const CustomInput = props => <TextField {...props} size='small' variant='outlined' />;

export default function PriceField({
  name,
  label,
  placeholder,
  margin = 'normal',
  variant = 'outlined',
  prefix,
  value,
  thousandSeparator = true,
  onValueChange,
  ...rest
}) {
  return (
    <NumberFormat
      {...rest}
      name={name}
      margin={margin}
      placeholder={placeholder}
      variant={variant}
      thousandSeparator={thousandSeparator}
      label={label}
      prefix={prefix}
      customInput={CustomInput}
      allowNegative={false}
      value={value}
      onValueChange={onValueChange}
    />
  );
}
