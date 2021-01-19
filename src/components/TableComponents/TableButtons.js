import React from 'react';

import { Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { Link } from '@reach/router';

export function CreateButton({ title = 'Create', to = '', onClick, ...rest }) {
  return (
    <Link style={{ textDecoration: 'none' }} to={to}>
      <Button color='primary' variant='contained' startIcon={<AddIcon />} onClick={onClick} {...rest}>
        {title}
      </Button>
    </Link>
  );
}

export function PreviewButton({ title = 'View', to = '', onClick, ...rest }) {
  return (
    <Link style={{ textDecoration: 'none' }} to={to}>
      <Button color='secondary' startIcon={<VisibilityIcon />} onClick={onClick} {...rest}>
        {title}
      </Button>
    </Link>
  );
}

export function EditButton({ title = 'Edit', to = '', onClick, ...rest }) {
  return (
    <Link style={{ textDecoration: 'none' }} to={to}>
      <Button color='secondary' startIcon={<EditIcon />} onClick={onClick} {...rest}>
        {title}
      </Button>
    </Link>
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
