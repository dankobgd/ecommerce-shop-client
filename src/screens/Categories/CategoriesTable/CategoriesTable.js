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

import categorySlice, { categoryDelete } from '../../../store/category/categorySlice';

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

const CategoriesTable = props => {
  const { className, categories, ...rest } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [selectedCategories, setSelectedCategories] = useState([]);
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
      selected = categories.map(category => category.id);
    } else {
      selected = [];
    }

    setSelectedCategories(selected);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedCategories.indexOf(id);
    let newSelectedCategories = [];

    if (selectedIndex === -1) {
      newSelectedCategories = newSelectedCategories.concat(selectedCategories, id);
    } else if (selectedIndex === 0) {
      newSelectedCategories = newSelectedCategories.concat(selectedCategories.slice(1));
    } else if (selectedIndex === selectedCategories.length - 1) {
      newSelectedCategories = newSelectedCategories.concat(selectedCategories.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedCategories = newSelectedCategories.concat(
        selectedCategories.slice(0, selectedIndex),
        selectedCategories.slice(selectedIndex + 1)
      );
    }

    setSelectedCategories(newSelectedCategories);
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
                    checked={selectedCategories.length === categories.length}
                    color='primary'
                    indeterminate={selectedCategories.length > 0 && selectedCategories.length < categories.length}
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
              {categories.length > 0 &&
                categories.slice(0, rowsPerPage).map(category => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={nanoid()}
                    selected={selectedCategories.indexOf(category.id) !== -1}
                  >
                    <TableCell padding='checkbox'>
                      <Checkbox
                        checked={selectedCategories.indexOf(category.id) !== -1}
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
                      <Link to={`${category.id}/${category.slug}/edit`} style={{ textDecoration: 'none' }}>
                        <Button
                          variant='outlined'
                          color='secondary'
                          startIcon={<EditIcon />}
                          onClick={() => dispatch(categorySlice.actions.setSelectedId(category.id))}
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
                            onClick={() => {
                              handleDialogClose();
                              dispatch(categoryDelete(category.id));
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
          count={categories.length}
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

export default CategoriesTable;
