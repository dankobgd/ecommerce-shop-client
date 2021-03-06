import React from 'react';

import { Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import { makeStyles } from '@material-ui/styles';
import { Link } from '@reach/router';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(3),
  },
  row: {
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1),
  },
  spacer: {
    flexGrow: 1,
  },
  editButton: {
    marginRight: theme.spacing(1),
  },
  searchInput: {
    marginRight: theme.spacing(1),
  },
}));

const PreviewToolbar = props => {
  const { className, productId, productSlug, reviewId, ...rest } = props;
  const classes = useStyles();

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <div className={classes.row}>
        <span className={classes.spacer} />
        <Link
          to={`/products/${productId}/${productSlug}/reviews/${reviewId}/edit`}
          style={{ textDecoration: 'none' }}
          className={classes.editButton}
        >
          <Button startIcon={<EditIcon />} variant='contained'>
            Edit Review
          </Button>
        </Link>
        <Link to={`/products/${productId}/${productSlug}/reviews/create`} style={{ textDecoration: 'none' }}>
          <Button startIcon={<AddIcon />} color='primary' variant='contained'>
            Add Review
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PreviewToolbar;
