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

import reviewSlice, { reviewDelete, reviewGetAll, selectPaginationMeta } from '../../../store/review/reviewSlice';
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

const ReviewsTable = props => {
  const { className, reviews, ...rest } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const paginationMeta = useSelector(selectPaginationMeta);
  const [selectedReviews, setSelectedReviews] = useState([]);
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
      selected = reviews.map(rev => rev.id);
    } else {
      selected = [];
    }

    setSelectedReviews(selected);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedReviews.indexOf(id);
    let newSelectedReviews = [];

    if (selectedIndex === -1) {
      newSelectedReviews = newSelectedReviews.concat(selectedReviews, id);
    } else if (selectedIndex === 0) {
      newSelectedReviews = newSelectedReviews.concat(selectedReviews.slice(1));
    } else if (selectedIndex === selectedReviews.length - 1) {
      newSelectedReviews = newSelectedReviews.concat(selectedReviews.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedReviews = newSelectedReviews.concat(
        selectedReviews.slice(0, selectedIndex),
        selectedReviews.slice(selectedIndex + 1)
      );
    }

    setSelectedReviews(newSelectedReviews);
  };

  const handlePageChange = (e, page) => {
    const params = new URLSearchParams({ per_page: paginationMeta.perPage, page: page + 1 });
    dispatch(reviewGetAll(params));
  };

  const handleRowsPerPageChange = e => {
    const params = new URLSearchParams({ per_page: e.target.value });
    dispatch(reviewGetAll(params));
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
                    checked={selectedReviews.length === reviews.length}
                    color='primary'
                    indeterminate={selectedReviews.length > 0 && selectedReviews.length < reviews.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>ID</TableCell>
                <TableCell>ProductID</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Comment</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {paginationMeta &&
                reviews.length > 0 &&
                reviews.slice(start, end).map(review => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={nanoid()}
                    selected={selectedReviews.indexOf(review.id) !== -1}
                  >
                    <TableCell padding='checkbox'>
                      <Checkbox
                        checked={selectedReviews.indexOf(review.id) !== -1}
                        color='primary'
                        onChange={event => handleSelectOne(event, review.id)}
                        value='true'
                      />
                    </TableCell>
                    <TableCell>{review.id}</TableCell>
                    <TableCell>{review.productId}</TableCell>
                    <TableCell>{review.rating}</TableCell>
                    <TableCell>{review.comment}</TableCell>
                    <TableCell>
                      <Link to={`${review.id}/edit`} style={{ textDecoration: 'none' }}>
                        <Button
                          variant='outlined'
                          color='secondary'
                          startIcon={<EditIcon />}
                          onClick={() => dispatch(reviewSlice.actions.setEditId(review.id))}
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
                        aria-labelledby='delete review dialog'
                        aria-describedby='deletes the review'
                      >
                        <DialogTitle id='delete review dialog'>Delete Review?</DialogTitle>
                        <DialogContent>
                          <DialogContentText>
                            Are you sure you want to delete the review <strong>{review.name}</strong> ?
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleDialogClose} color='primary'>
                            Cancel
                          </Button>
                          <Button
                            onClick={() => {
                              handleDialogClose();
                              dispatch(reviewDelete(review.id));
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

export default ReviewsTable;
