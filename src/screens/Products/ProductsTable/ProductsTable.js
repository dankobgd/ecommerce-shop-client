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
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0,
  },
  inner: {
    minWidth: 1050,
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
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

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

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
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
                <TableCell>Email</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Registration date</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {products.slice(0, rowsPerPage).map(product => (
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
                      <Avatar className={classes.avatar} src={product.avatar}>
                        {product.name.substr(0, 2).toUpperCase()}
                      </Avatar>
                      <Typography variant='body1'>{product.name}</Typography>
                    </div>
                  </TableCell>
                  <TableCell>{product.email}</TableCell>
                  <TableCell>
                    {product.address.city}, {product.address.state}, {product.address.country}
                  </TableCell>
                  <TableCell>{product.phone}</TableCell>
                  <TableCell>{new Date().toUTCString()}</TableCell>
                  <TableCell>
                    <Button variant='outlined' color='secondary' startIcon={<EditIcon />}>
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardActions className={classes.actions}>
        <TablePagination
          component='div'
          count={products.length}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleRowsPerPageChange}
          page={currentPage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </CardActions>
    </Card>
  );
};

export default ProductsTable;
