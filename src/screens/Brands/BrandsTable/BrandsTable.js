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

function BrandsTable({ className, info, ...rest }) {
  const classes = useStyles();
  const { data: brands } = info;

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
    const selected = event.target.checked ? brands?.data?.map(x => x.id) : [];
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
    const params = new URLSearchParams({ per_page: brands?.meta?.perPage, page: page + 1 });
    // @TODO: use paginated query...
    // dispatch(brandGetAll(`${params}`));
  };

  const handleRowsPerPageChange = e => {
    const params = new URLSearchParams({ per_page: e.target.value });
    // @TODO: use paginated query...
    // dispatch(brandGetAll(`${params}`));
  };

  const { start, end } = calculatePaginationStartEndPosition(brands?.meta?.page, brands?.meta?.perPage);

  const [deleteBrand] = useMutation(id => api.brands.delete(id), {
    onMutate: id => {
      cache.cancelQueries('brands');
      const previousValue = cache.getQueryData('brands');
      const filtered = previousValue?.data?.filter(x => x.id !== id);
      const obj = { ...previousValue, data: [...filtered] };
      cache.setQueryData('brands', obj);
      return previousValue;
    },
    onSuccess: () => {
      toast.success('Brand deleted');
    },
    onError: (_, __, previousValue) => {
      cache.setQueryData('brands', previousValue);
      toast.error('Error deleting the brand');
    },
    onSettled: () => {
      cache.invalidateQueries('brands');
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
                    checked={selectedData?.length === brands?.data?.length}
                    color='primary'
                    indeterminate={selectedData?.length > 0 && selectedData?.length < brands?.data?.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Name</TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Slug</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Website</TableCell>
                <TableCell>Logo URL</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {brands?.meta &&
                brands.data.length > 0 &&
                brands.data.slice(start, end).map(brand => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={nanoid()}
                    selected={selectedData.indexOf(brand.id) !== -1}
                  >
                    <TableCell padding='checkbox'>
                      <Checkbox
                        checked={selectedData.indexOf(brand.id) !== -1}
                        color='primary'
                        onChange={event => handleSelectOne(event, brand.id)}
                        value='true'
                      />
                    </TableCell>
                    <TableCell>
                      <div className={classes.nameContainer}>
                        <Avatar className={classes.avatar} src={brand.logo} />
                        <Typography variant='body1'>{brand.name}</Typography>
                      </div>
                    </TableCell>
                    <TableCell>{brand.id}</TableCell>
                    <TableCell>{brand.slug}</TableCell>
                    <TableCell>{brand.type}</TableCell>
                    <TableCell>{brand.description}</TableCell>
                    <TableCell>{brand.email}</TableCell>
                    <TableCell>{brand.websiteUrl}</TableCell>
                    <TableCell>
                      <Link to={`${brand.id}/${brand.slug}/preview`} style={{ textDecoration: 'none' }}>
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
                      <Link to={`${brand.id}/${brand.slug}/edit`} style={{ textDecoration: 'none' }}>
                        <Button
                          color='secondary'
                          startIcon={<EditIcon />}
                          // onClick={() => dispatch(brandSlice.actions.setEditId(brand.id))}
                        >
                          Edit
                        </Button>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Button
                        style={{ color: 'red' }}
                        startIcon={<DeleteIcon style={{ fill: 'red' }} />}
                        onClick={() => handleDialogOpen()}
                      >
                        Delete
                      </Button>
                      <Dialog
                        open={dialogOpen}
                        onClose={handleDialogClose}
                        aria-labelledby='delete brand dialog'
                        aria-describedby='deletes the brand'
                      >
                        <DialogTitle id='delete brand dialog'>Delete Brand?</DialogTitle>
                        <DialogContent>
                          <DialogContentText>
                            Are you sure you want to delete the brand <strong>{brand.name}</strong> ?
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleDialogClose} color='primary'>
                            Cancel
                          </Button>
                          <Button
                            onClick={async () => {
                              handleDialogClose();
                              await deleteBrand(brand.id);
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
        {brands?.meta && (
          <TablePagination
            component='div'
            count={brands?.meta?.totalCount || -1}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handleRowsPerPageChange}
            page={brands?.meta?.page - 1 || 0}
            rowsPerPage={brands?.meta?.perPage || 50}
            rowsPerPageOptions={[10, 25, 50, 75, 120]}
          />
        )}
      </CardActions>
    </Card>
  );
}

export default BrandsTable;
