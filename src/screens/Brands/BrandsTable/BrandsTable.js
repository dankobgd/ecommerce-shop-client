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
import { nanoid } from 'nanoid';
import { useDispatch } from 'react-redux';

import brandSlice, { brandDelete } from '../../../store/brand/brandSlice';

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

const BrandsTable = props => {
  const { className, brands, ...rest } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
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
      selected = brands.map(brand => brand.id);
    } else {
      selected = [];
    }

    setSelectedBrands(selected);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedBrands.indexOf(id);
    let newSelectedBrands = [];

    if (selectedIndex === -1) {
      newSelectedBrands = newSelectedBrands.concat(selectedBrands, id);
    } else if (selectedIndex === 0) {
      newSelectedBrands = newSelectedBrands.concat(selectedBrands.slice(1));
    } else if (selectedIndex === selectedBrands.length - 1) {
      newSelectedBrands = newSelectedBrands.concat(selectedBrands.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedBrands = newSelectedBrands.concat(
        selectedBrands.slice(0, selectedIndex),
        selectedBrands.slice(selectedIndex + 1)
      );
    }

    setSelectedBrands(newSelectedBrands);
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
                    checked={selectedBrands.length === brands.length}
                    color='primary'
                    indeterminate={selectedBrands.length > 0 && selectedBrands.length < brands.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Name</TableCell>
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
              {brands.length > 0 &&
                brands.slice(0, rowsPerPage).map(brand => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={nanoid()}
                    selected={selectedBrands.indexOf(brand.id) !== -1}
                  >
                    <TableCell padding='checkbox'>
                      <Checkbox
                        checked={selectedBrands.indexOf(brand.id) !== -1}
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
                    <TableCell>{brand.name}</TableCell>
                    <TableCell>{brand.slug}</TableCell>
                    <TableCell>{brand.type}</TableCell>
                    <TableCell>{brand.description}</TableCell>
                    <TableCell>{brand.email}</TableCell>
                    <TableCell>{brand.websiteUrl}</TableCell>
                    <TableCell>
                      <Link to='edit' style={{ textDecoration: 'none' }}>
                        <Button
                          variant='outlined'
                          color='secondary'
                          startIcon={<EditIcon />}
                          onClick={() => dispatch(brandSlice.actions.setSelectedId(brand.id))}
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
                            onClick={() => {
                              handleDialogClose();
                              dispatch(brandDelete(brand.id));
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
        <TablePagination
          component='div'
          count={brands.length}
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

export default BrandsTable;
