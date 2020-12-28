import React from 'react';

import { Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { Link } from '@reach/router';

/* eslint-disable react/display-name */
const CustomRouterLink = React.forwardRef((props, ref) => (
  <div ref={ref}>
    <Link {...props} style={{ textDecoration: 'none' }} />
  </div>
));

export function PreviewButton({ title = 'View', to = '', onClick, ...rest }) {
  return (
    <Button
      color='secondary'
      startIcon={<VisibilityIcon />}
      component={CustomRouterLink}
      onClick={onClick}
      to={to}
      {...rest}
    >
      {title}
    </Button>
  );
}

export function EditButton({ title = 'Edit', to = '', onClick, ...rest }) {
  return (
    <Button color='secondary' startIcon={<EditIcon />} component={CustomRouterLink} onClick={onClick} to={to} {...rest}>
      {title}
    </Button>
  );
}

export function DeleteButton({ title = 'Delete', onClick, ...rest }) {
  return (
    <Button
      color='secondary'
      style={{ color: 'red' }}
      startIcon={<DeleteIcon style={{ fill: 'red' }} />}
      onClick={onClick}
      {...rest}
    >
      {title}
    </Button>
  );
}
