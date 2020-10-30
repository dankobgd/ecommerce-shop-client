import React from 'react';

import { makeStyles } from '@material-ui/styles';
import { useDispatch, useSelector } from 'react-redux';

import { promotionGetAll, selectAllPromotions } from '../../store/promotion/promotionSlice';
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
  const dispatch = useDispatch();
  const promotions = useSelector(selectAllPromotions);

  React.useEffect(() => {
    dispatch(promotionGetAll());
  }, [dispatch]);

  return (
    <div className={classes.root}>
      <PromotionsToolbar />
      <div className={classes.content}>
        <PromotionsTable promotions={promotions} />
      </div>
    </div>
  );
}

export default Promotions;
