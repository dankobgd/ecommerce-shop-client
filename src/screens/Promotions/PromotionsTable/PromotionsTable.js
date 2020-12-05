import React, { useContext, useState } from 'react';

import {
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { makeStyles } from '@material-ui/styles';
import { Link } from '@reach/router';
import clsx from 'clsx';
import { nanoid } from 'nanoid';
import { useMutation, useQueryCache } from 'react-query';

import api from '../../../api';
import { ToastContext } from '../../../store/toast/toast';
import { calculatePaginationStartEndPosition } from '../../../utils/pagination';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0,
  },
  inner: {
    minWidth: 1050,
    overflowX: 'auto',
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  avatar: {
    marginRight: theme.spacing(2),
  },
  actions: {
    justifyContent: 'flex-end',
  },
}));

const PromotionsTable = ({ className, info, ...rest }) => {
  const classes = useStyles();
  const { data: promotions } = info;

  const toast = useContext(ToastContext);
  const cache = useQueryCache();

  const [selectedData, setSelectedData] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleSelectAll = event => {
    const selected = event.target.checked ? promotions?.data?.map(x => x.id) : [];
    setSelectedData(selected);
  };

  const handleSelectOne = (event, code) => {
    const selectedIndex = selectedData.indexOf(code);
    let newSelectedData = [];

    if (selectedIndex === -1) {
      newSelectedData = newSelectedData.concat(selectedData, code);
    } else if (selectedIndex === 0) {
      newSelectedData = newSelectedData.concat(selectedData.slice(1));
    } else if (selectedIndex === selectedData.length - 1) {
      newSelectedData = newSelectedData.concat(selectedData.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedData = newSelectedData.concat(
        selectedData.slice(0, selectedIndex),
        selectedData.slice(selectedIndex + 1)
      );
    }

    setSelectedData(newSelectedData);
  };

  const handlePageChange = (e, page) => {
    const params = new URLSearchParams({ per_page: promotions?.meta.perPage, page: page + 1 });
    // @TODO: use paginated query...
    // dispatch(promotionGetAll(`${params}`));
  };

  const handleRowsPerPageChange = e => {
    const params = new URLSearchParams({ per_page: e.target.value });
    // @TODO: use paginated query...
    /// dispatch(promotionGetAll(`${params}`));
  };

  const { start, end } = calculatePaginationStartEndPosition(promotions?.meta?.page, promotions?.meta?.perPage);

  const [deletePromotion] = useMutation(code => api.promotions.delete(code), {
    onMutate: code => {
      cache.cancelQueries('promotions');
      const previousValue = cache.getQueryData('promotions');
      const filtered = previousValue?.data?.filter(x => x.promoCode !== code);
      const obj = { ...previousValue, data: [...filtered] };
      cache.setQueryData('promotions', obj);
      return previousValue;
    },
    onSuccess: () => {
      toast.success('Promotion deleted');
    },
    onError: (_, __, previousValue) => {
      cache.setQueryData('promotions', previousValue);
      toast.error('Error deleting the promotion');
    },
    onSettled: () => {
      cache.invalidateQueries('promotions');
    },
  });

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardContent className={classes.content}>
        <div className={classes.inner}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding='checkbox'>
                  <Checkbox
                    checked={selectedData?.length === promotions?.data?.length}
                    color='primary'
                    indeterminate={selectedData?.length > 0 && selectedData?.length < promotions?.data?.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>PromoCode</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Starts at</TableCell>
                <TableCell>Ends at</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {promotions?.meta &&
                promotions.data.length > 0 &&
                promotions.data.slice(start, end).map(promotion => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={nanoid()}
                    selected={selectedData.indexOf(promotion.promoCode) !== -1}
                  >
                    <TableCell padding='checkbox'>
                      <Checkbox
                        checked={selectedData.indexOf(promotion.promoCode) !== -1}
                        color='primary'
                        onChange={event => handleSelectOne(event, promotion.promoCode)}
                        value='true'
                      />
                    </TableCell>
                    <TableCell>{promotion.promoCode}</TableCell>
                    <TableCell>{promotion.type}</TableCell>
                    <TableCell>{promotion.amount}</TableCell>
                    <TableCell>{promotion.description}</TableCell>
                    <TableCell>{promotion.startsAt}</TableCell>
                    <TableCell>{promotion.endsAt}</TableCell>
                    <TableCell>
                      <Link to={`${promotion.promoCode}/preview`} style={{ textDecoration: 'none' }}>
                        <Button
                          color='secondary'
                          startIcon={<VisibilityIcon />}
                          // onClick={() => dispatch(productSlice.actions.setPreviewId(product.id))}
                        >
                          View
                        </Button>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link to={`${promotion.promoCode}/edit`} style={{ textDecoration: 'none' }}>
                        <Button
                          color='secondary'
                          startIcon={<EditIcon />}
                          // onClick={() => dispatch(promotionSlice.actions.setEditId(promotion.promoCode))}
                        >
                          Edit
                        </Button>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Button
                        style={{ color: 'red' }}
                        color='secondary'
                        startIcon={<DeleteIcon style={{ fill: 'red' }} />}
                        onClick={() => handleDialogOpen()}
                      >
                        Delete
                      </Button>
                      <Dialog
                        open={dialogOpen}
                        onClose={handleDialogClose}
                        aria-labelledby='delete promotion dialog'
                        aria-describedby='deletes the promotion'
                      >
                        <DialogTitle id='delete promotion dialog'>Delete Promotion?</DialogTitle>
                        <DialogContent>
                          <DialogContentText>
                            Are you sure you want to delete the promotion <strong>{promotion.name}</strong> ?
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleDialogClose} color='primary'>
                            Cancel
                          </Button>
                          <Button
                            onClick={async () => {
                              handleDialogClose();
                              await deletePromotion(promotion.promoCode);
                            }}
                            color='primary'
                            autoFocus
                          >
                            Delete
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardActions className={classes.actions}>
        {promotions?.meta && (
          <TablePagination
            component='div'
            count={promotions?.meta?.totalCount || -1}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handleRowsPerPageChange}
            page={promotions?.meta?.page - 1 || 0}
            rowsPerPage={promotions?.meta?.perPage || 50}
            rowsPerPageOptions={[10, 25, 50, 75, 120]}
          />
        )}
      </CardActions>
    </Card>
  );
};

export default PromotionsTable;
