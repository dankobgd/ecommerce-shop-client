import React, { useContext, useState } from 'react';

import {
  Card,
  CardActions,
  CardContent,
  Avatar,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
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

const CategoriesTable = ({ className, info, ...rest }) => {
  const classes = useStyles();
  const { data: categories } = info;

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
    const selected = event.target.checked ? categories?.data?.map(x => x.id) : [];
    setSelectedData(selected);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedData.indexOf(id);
    let newSelectedData = [];

    if (selectedIndex === -1) {
      newSelectedData = newSelectedData.concat(selectedData, id);
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
    const params = new URLSearchParams({ per_page: categories?.meta?.perPage, page: page + 1 });
    // @TODO: use paginated query...
    // dispatch(categoryGetAll(`${params}`));
  };

  const handleRowsPerPageChange = e => {
    const params = new URLSearchParams({ per_page: e.target.value });
    // @TODO: use paginated query...
    // dispatch(categoryGetAll(`${params}`));
  };

  const { start, end } = calculatePaginationStartEndPosition(categories?.meta?.page, categories?.meta?.perPage);

  const [deleteCategory] = useMutation(id => api.categories.delete(id), {
    onMutate: id => {
      cache.cancelQueries('categories');
      const previousValue = cache.getQueryData('categories');
      const filtered = previousValue?.data?.filter(x => x.id !== id);
      const obj = { ...previousValue, data: [...filtered] };
      cache.setQueryData('categories', obj);
      return previousValue;
    },
    onSuccess: () => {
      toast.success('Category deleted');
    },
    onError: (_, __, previousValue) => {
      cache.setQueryData('categories', previousValue);
      toast.error('Error deleting the category');
    },
    onSettled: () => {
      cache.invalidateQueries('categories');
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
                    checked={selectedData?.length === categories?.data?.length}
                    color='primary'
                    indeterminate={selectedData?.length > 0 && selectedData?.length < categories?.data?.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Name</TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Slug</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Logo URL</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {categories?.meta &&
                categories.data.length > 0 &&
                categories.data.slice(start, end).map(category => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={nanoid()}
                    selected={selectedData.indexOf(category.id) !== -1}
                  >
                    <TableCell padding='checkbox'>
                      <Checkbox
                        checked={selectedData.indexOf(category.id) !== -1}
                        color='primary'
                        onChange={event => handleSelectOne(event, category.id)}
                        value='true'
                      />
                    </TableCell>
                    <TableCell>
                      <div className={classes.nameContainer}>
                        <Avatar className={classes.avatar} src={category.logo} />
                        <Typography variant='body1'>{category.name}</Typography>
                      </div>
                    </TableCell>
                    <TableCell>{category.id}</TableCell>
                    <TableCell>{category.slug}</TableCell>
                    <TableCell>{category.description}</TableCell>
                    <TableCell>{category.logo}</TableCell>
                    <TableCell>
                      <Link to={`${category.id}/${category.slug}/preview`} style={{ textDecoration: 'none' }}>
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
                      <Link to={`${category.id}/${category.slug}/edit`} style={{ textDecoration: 'none' }}>
                        <Button
                          color='secondary'
                          startIcon={<EditIcon />}
                          // onClick={() => dispatch(categorySlice.actions.setEditId(category.id))}
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
                        aria-labelledby='delete category dialog'
                        aria-describedby='deletes the category'
                      >
                        <DialogTitle id='delete category dialog'>Delete Category?</DialogTitle>
                        <DialogContent>
                          <DialogContentText>
                            Are you sure you want to delete the category <strong>{category.name}</strong> ?
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleDialogClose} color='primary'>
                            Cancel
                          </Button>
                          <Button
                            onClick={async () => {
                              handleDialogClose();
                              await deleteCategory(category.id);
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
        {categories?.meta && (
          <TablePagination
            component='div'
            count={categories?.meta?.totalCount || -1}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handleRowsPerPageChange}
            page={categories?.meta?.page - 1 || 0}
            rowsPerPage={categories?.meta?.perPage || 50}
            rowsPerPageOptions={[10, 25, 50, 75, 120]}
          />
        )}
      </CardActions>
    </Card>
  );
};

export default CategoriesTable;
