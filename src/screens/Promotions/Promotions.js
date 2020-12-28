import React from 'react';

import { makeStyles } from '@material-ui/styles';

import PromotionsTable from './PromotionsTable/PromotionsTable';
import PromotionsToolbar from './PromotionsToolbar/PromotionsToolbar';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3),
  },
  content: {
    marginTop: theme.spacing(2),
  },
}));

function Promotions() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <PromotionsToolbar />
      <div className={classes.content}>
        <PromotionsTable />
      </div>
    </div>
  );
}

export default Promotions;
