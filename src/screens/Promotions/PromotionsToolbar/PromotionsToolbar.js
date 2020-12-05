import React from 'react';

import { Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/styles';
import { Link } from '@reach/router';
import clsx from 'clsx';

import SearchInput from '../../../components/SearchInput/SearchInput';

const useStyles = makeStyles(theme => ({
  root: {},
  row: {
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1),
  },
  spacer: {
    flexGrow: 1,
  },
  importButton: {
    marginRight: theme.spacing(1),
  },
  exportButton: {
    marginRight: theme.spacing(1),
  },
  searchInput: {
    marginRight: theme.spacing(1),
  },
}));

const PromotionsToolbar = props => {
  const { className, ...rest } = props;
  const classes = useStyles();

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <div className={classes.row}>
        <span className={classes.spacer} />
        <Button className={classes.importButton}>Import</Button>
        <Button className={classes.exportButton}>Export</Button>
        <Link to='create' style={{ textDecoration: 'none' }}>
          <Button startIcon={<AddIcon />} color='primary' variant='contained'>
            Add Promotion
          </Button>
        </Link>
      </div>
      <div className={classes.row}>
        <SearchInput className={classes.searchInput} placeholder='Search Promotion' />
      </div>
    </div>
  );
};

export default PromotionsToolbar;
