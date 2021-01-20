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
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';

import DeleteDialog from '../../../components/TableComponents/DeleteDialog';
import { DeleteButton, EditButton, PreviewButton } from '../../../components/TableComponents/TableButtons';
import { useCategories, useDeleteCategory, useDeleteCategories } from '../../../hooks/queries/categoryQueries';
import { diff } from '../../../utils/diff';
import { getPersistedPagination, paginationRanges, persistPagination } from '../../../utils/pagination';

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

const CategoriesTable = ({ className, ...rest }) => {
  const classes = useStyles();
  const [pageMeta, setPageMeta] = useState(getPersistedPagination('categories'));
  const { data: categories } = useCategories(pageMeta, { keepPreviousData: true });
  const deleteCategoryMutation = useDeleteCategory();
  const deleteCategoriesMutation = useDeleteCategories();

  const [deleteItem, setDeleteItem] = useState();
  const [selectedData, setSelectedData] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };
  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleBulkDeleteDialogOpen = () => {
    setBulkDeleteDialogOpen(true);
  };
  const handleBulkDeleteDialogClose = () => {
    setBulkDeleteDialogOpen(false);
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
    const params = { page: page + 1, per_page: categories?.meta?.perPage };
    if (Object.keys(diff(pageMeta, params).length > 0)) {
      setPageMeta(meta => ({ ...meta, ...params }));
    }
  };

  const handleRowsPerPageChange = e => {
    const params = { page: 1, per_page: e.target.value };
    if (Object.keys(diff(pageMeta, params).length > 0)) {
      setPageMeta(meta => ({ ...meta, ...params }));
    }
  };

  React.useEffect(() => {
    persistPagination('categories', pageMeta);
  }, [pageMeta]);

  return (
    <>
      <Card {...rest} className={clsx(classes.root, className)}>
        <CardContent className={classes.content}>
          {selectedData?.length > 0 && (
            <Button
              size='small'
              variant='contained'
              style={{ backgroundColor: '#dc004e', color: '#fff', margin: '1rem' }}
              startIcon={<DeleteIcon />}
              onClick={() => {
                handleBulkDeleteDialogOpen();
              }}
            >
              Delete {selectedData.length} categories
            </Button>
          )}
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
                {categories?.data?.map(category => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={category.id}
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
                      <PreviewButton to={`${category.id}/${category.slug}/preview`} />
                    </TableCell>
                    <TableCell>
                      <EditButton to={`${category.id}/${category.slug}/edit`} />
                    </TableCell>
                    <TableCell>
                      <DeleteButton
                        onClick={() => {
                          setDeleteItem(category);
                          handleDialogOpen();
                        }}
                      />
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
              page={pageMeta.page - 1}
              rowsPerPage={pageMeta?.per_page}
              rowsPerPageOptions={paginationRanges}
            />
          )}
        </CardActions>
      </Card>

      <DeleteDialog
        title='category'
        item={deleteItem?.name}
        handleDialogClose={handleDialogClose}
        dialogOpen={dialogOpen}
        onClick={() => {
          handleDialogClose();
          deleteCategoryMutation.mutate(deleteItem.id);
        }}
      />

      <DeleteDialog
        title={`${selectedData.length} categories`}
        handleDialogClose={handleBulkDeleteDialogClose}
        dialogOpen={bulkDeleteDialogOpen}
        onClick={() => {
          handleBulkDeleteDialogClose();
          deleteCategoriesMutation.mutate(selectedData, {
            onSuccess: () => setSelectedData([]),
          });
        }}
      />
    </>
  );
};

export default CategoriesTable;
