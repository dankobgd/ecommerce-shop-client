import React, { useState } from 'react';

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
import { makeStyles } from '@material-ui/styles';
import { Link } from '@reach/router';
import clsx from 'clsx';
import { nanoid } from 'nanoid';
import { useDispatch, useSelector } from 'react-redux';

import promotionSlice, {
  promotionDelete,
  promotionGetAll,
  selectPaginationMeta,
} from '../../../store/promotion/promotionSlice';
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

const PromotionsTable = props => {
  const { className, promotions, ...rest } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const paginationMeta = useSelector(selectPaginationMeta);
  const [selectedPromotions, setSelectedPromotions] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleSelectAll = event => {
    let selected;

    if (event.target.checked) {
      selected = promotions.map(p => p.promoCode);
    } else {
      selected = [];
    }

    setSelectedPromotions(selected);
  };

  const handleSelectOne = (event, code) => {
    const selectedIndex = selectedPromotions.indexOf(code);
    let newSelectedPromotions = [];

    if (selectedIndex === -1) {
      newSelectedPromotions = newSelectedPromotions.concat(selectedPromotions, code);
    } else if (selectedIndex === 0) {
      newSelectedPromotions = newSelectedPromotions.concat(selectedPromotions.slice(1));
    } else if (selectedIndex === selectedPromotions.length - 1) {
      newSelectedPromotions = newSelectedPromotions.concat(selectedPromotions.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedPromotions = newSelectedPromotions.concat(
        selectedPromotions.slice(0, selectedIndex),
        selectedPromotions.slice(selectedIndex + 1)
      );
    }

    setSelectedPromotions(newSelectedPromotions);
  };

  const handlePageChange = (e, page) => {
    const params = new URLSearchParams({ per_page: paginationMeta.perPage, page: page + 1 });
    dispatch(promotionGetAll(`${params}`));
  };

  const handleRowsPerPageChange = e => {
    const params = new URLSearchParams({ per_page: e.target.value });
    dispatch(promotionGetAll(`${params}`));
  };

  const { start, end } = calculatePaginationStartEndPosition(paginationMeta?.page, paginationMeta?.perPage);

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardContent className={classes.content}>
        <div className={classes.inner}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding='checkbox'>
                  <Checkbox
                    checked={selectedPromotions.length === promotions.length}
                    color='primary'
                    indeterminate={selectedPromotions.length > 0 && selectedPromotions.length < promotions.length}
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
              {paginationMeta &&
                promotions.length > 0 &&
                promotions.slice(start, end).map(promotion => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={nanoid()}
                    selected={selectedPromotions.indexOf(promotion.promoCode) !== -1}
                  >
                    <TableCell padding='checkbox'>
                      <Checkbox
                        checked={selectedPromotions.indexOf(promotion.promoCode) !== -1}
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
                      <Link to={`${promotion.promoCode}/edit`} style={{ textDecoration: 'none' }}>
                        <Button
                          variant='outlined'
                          color='secondary'
                          startIcon={<EditIcon />}
                          onClick={() => dispatch(promotionSlice.actions.setEditId(promotion.promoCode))}
                        >
                          Edit
                        </Button>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant='outlined'
                        color='secondary'
                        startIcon={<DeleteIcon />}
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
                            onClick={() => {
                              handleDialogClose();
                              dispatch(promotionDelete(promotion.promoCode));
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
        {paginationMeta && (
          <TablePagination
            component='div'
            count={paginationMeta.totalCount || -1}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handleRowsPerPageChange}
            page={paginationMeta.page - 1 || 0}
            rowsPerPage={paginationMeta.perPage || 50}
            rowsPerPageOptions={[10, 25, 50, 75, 120]}
          />
        )}
      </CardActions>
    </Card>
  );
};

export default PromotionsTable;
