import React, { useState } from 'react';

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
import { makeStyles } from '@material-ui/styles';
import { Link } from '@reach/router';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';

import productSlice, { productDelete, selectPaginationMeta, productGetAll } from '../../../store/product/productSlice';

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

const ProductsTable = props => {
  const { className, products, ...rest } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const paginationMeta = useSelector(selectPaginationMeta);
  const [selectedProducts, setSelectedProducts] = useState([]);
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
      selected = products.map(product => product.id);
    } else {
      selected = [];
    }

    setSelectedProducts(selected);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedProducts.indexOf(id);
    let newSelectedProducts = [];

    if (selectedIndex === -1) {
      newSelectedProducts = newSelectedProducts.concat(selectedProducts, id);
    } else if (selectedIndex === 0) {
      newSelectedProducts = newSelectedProducts.concat(selectedProducts.slice(1));
    } else if (selectedIndex === selectedProducts.length - 1) {
      newSelectedProducts = newSelectedProducts.concat(selectedProducts.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedProducts = newSelectedProducts.concat(
        selectedProducts.slice(0, selectedIndex),
        selectedProducts.slice(selectedIndex + 1)
      );
    }

    setSelectedProducts(newSelectedProducts);
  };

  const handlePageChange = (e, page) => {
    const params = new URLSearchParams({ per_page: paginationMeta.perPage, page: page + 1 });
    dispatch(productGetAll(params));
  };

  const handleRowsPerPageChange = e => {
    const params = new URLSearchParams({ per_page: e.target.value });
    dispatch(productGetAll(params));
  };

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardContent className={classes.content}>
        <div className={classes.inner}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding='checkbox'>
                  <Checkbox
                    checked={selectedProducts.length === products.length}
                    color='primary'
                    indeterminate={selectedProducts.length > 0 && selectedProducts.length < products.length}
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
              {paginationMeta &&
                products.length > 0 &&
                products.slice(0, paginationMeta.perPage).map(product => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={product.id}
                    selected={selectedProducts.indexOf(product.id) !== -1}
                  >
                    <TableCell padding='checkbox'>
                      <Checkbox
                        checked={selectedProducts.indexOf(product.id) !== -1}
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
                    <TableCell>{product.price}</TableCell>
                    <TableCell>{product.description}</TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>{product.isFeatured.toString()}</TableCell>
                    <TableCell>{product.inStock.toString()}</TableCell>
                    <TableCell>{product.imageUrl}</TableCell>
                    <TableCell>{product.createdAt}</TableCell>
                    <TableCell>{product.updatedAt}</TableCell>
                    <TableCell>
                      <Link to={`${product.id}/${product.slug}/edit`} style={{ textDecoration: 'none' }}>
                        <Button
                          variant='outlined'
                          color='secondary'
                          startIcon={<EditIcon />}
                          onClick={() => dispatch(productSlice.actions.setEditId(product.id))}
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
                            onClick={() => {
                              handleDialogClose();
                              dispatch(productDelete(product.id));
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
            rowsPerPageOptions={[10, 25, 50, 100]}
          />
        )}
      </CardActions>
    </Card>
  );
};

export default ProductsTable;
