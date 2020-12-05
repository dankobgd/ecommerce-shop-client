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
import { useMutation, useQueryCache } from 'react-query';

import api from '../../../api';
import { ToastContext } from '../../../store/toast/toast';
import { calculatePaginationStartEndPosition } from '../../../utils/pagination';
import { formatPriceForDisplay } from '../../../utils/priceFormat';
import { truncateText } from '../../../utils/truncateText';

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

const ProductsTable = ({ className, info, ...rest }) => {
  const classes = useStyles();
  const { data: products } = info;

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
    const selected = event.target.checked ? products?.data?.map(x => x.id) : [];
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
    const params = new URLSearchParams({ per_page: products?.meta?.perPage, page: page + 1 });
    // @TOD: use paginated query...
    // dispatch(productGetAll(`${params}`));
  };

  const handleRowsPerPageChange = e => {
    const params = new URLSearchParams({ per_page: e.target.value });
    // @TOD: use paginated query...
    // dispatch(productGetAll(`${params}`));
  };

  const { start, end } = calculatePaginationStartEndPosition(products?.meta?.page, products?.meta?.perPage);

  const [deleteProduct] = useMutation(id => api.products.delete(id), {
    onMutate: id => {
      cache.cancelQueries('products');
      const previousValue = cache.getQueryData('products');
      const filtered = previousValue?.data?.filter(x => x.id !== id);
      const obj = { ...previousValue, data: [...filtered] };
      cache.setQueryData('products', obj);
      return previousValue;
    },
    onSuccess: () => {
      toast.success('Product deleted');
    },
    onError: (_, __, previousValue) => {
      cache.setQueryData('products', previousValue);
      toast.error('Error deleting the product');
    },
    onSettled: () => {
      cache.invalidateQueries('products');
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
                    checked={selectedData?.length === products?.data?.length}
                    color='primary'
                    indeterminate={selectedData?.length > 0 && selectedData?.length < products?.data?.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Name</TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Slug</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>SKU</TableCell>
                <TableCell>Featured</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Thumbnail</TableCell>
                <TableCell>Created at</TableCell>
                <TableCell>Updated at</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {products?.meta &&
                products.data.length > 0 &&
                products.data.slice(start, end).map(product => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={product.sku}
                    selected={selectedData.indexOf(product.id) !== -1}
                  >
                    <TableCell padding='checkbox'>
                      <Checkbox
                        checked={selectedData.indexOf(product.id) !== -1}
                        color='primary'
                        onChange={event => handleSelectOne(event, product.id)}
                        value='true'
                      />
                    </TableCell>
                    <TableCell>
                      <div className={classes.nameContainer}>
                        <Avatar className={classes.avatar} src={product.imageUrl} />
                        <Typography variant='body1'>{product.name}</Typography>
                      </div>
                    </TableCell>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>{product.slug}</TableCell>
                    <TableCell>${formatPriceForDisplay(product.price)}</TableCell>
                    <TableCell>{truncateText(product.description, 50)}</TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>{product.isFeatured.toString()}</TableCell>
                    <TableCell>{product.inStock.toString()}</TableCell>
                    <TableCell>{product.imageUrl}</TableCell>
                    <TableCell>{product.createdAt}</TableCell>
                    <TableCell>{product.updatedAt}</TableCell>
                    <TableCell>
                      <Link to={`${product.id}/${product.slug}/preview`} style={{ textDecoration: 'none' }}>
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
                      <Link to={`${product.id}/${product.slug}/edit`} style={{ textDecoration: 'none' }}>
                        <Button
                          color='secondary'
                          startIcon={<EditIcon />}
                          // onClick={() => dispatch(productSlice.actions.setEditId(product.id))}
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
                        aria-labelledby='delete product dialog'
                        aria-describedby='deletes the product'
                      >
                        <DialogTitle id='delete product dialog'>Delete Product?</DialogTitle>
                        <DialogContent>
                          <DialogContentText>
                            Are you sure you want to delete the product <strong>{product.name}</strong> ?
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleDialogClose} color='primary'>
                            Cancel
                          </Button>
                          <Button
                            onClick={async () => {
                              handleDialogClose();
                              await deleteProduct(product.id);
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
        {products?.meta && (
          <TablePagination
            component='div'
            count={products?.meta?.totalCount || -1}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handleRowsPerPageChange}
            page={products?.meta?.page - 1 || 0}
            rowsPerPage={products?.meta?.perPage || 50}
            rowsPerPageOptions={[10, 25, 50, 75, 120]}
          />
        )}
      </CardActions>
    </Card>
  );
};

export default ProductsTable;
