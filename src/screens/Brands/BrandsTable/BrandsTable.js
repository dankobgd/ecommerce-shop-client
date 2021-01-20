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
import { nanoid } from 'nanoid';

import DeleteDialog from '../../../components/TableComponents/DeleteDialog';
import { DeleteButton, EditButton, PreviewButton } from '../../../components/TableComponents/TableButtons';
import { useBrands, useDeleteBrand, useDeleteBrands } from '../../../hooks/queries/brandQueries';
import { diff } from '../../../utils/diff';
import { getPersistedPagination, persistPagination } from '../../../utils/pagination';

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

function BrandsTable({ className, ...rest }) {
  const classes = useStyles();
  const [pageMeta, setPageMeta] = useState(getPersistedPagination('brands'));
  const { data: brands } = useBrands(pageMeta, { keepPreviousData: true });
  const deleteBrandMutation = useDeleteBrand();
  const deleteBrandsMutation = useDeleteBrands();

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
    const params = { page: page + 1, per_page: brands?.meta?.perPage };
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
    persistPagination('brands', pageMeta);
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
              Delete {selectedData.length} brands
            </Button>
          )}
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
                {brands?.data?.map(brand => (
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
                      <PreviewButton to={`${brand.id}/${brand.slug}/preview`} />
                    </TableCell>
                    <TableCell>
                      <EditButton to={`${brand.id}/${brand.slug}/edit`} />
                    </TableCell>
                    <TableCell>
                      <DeleteButton
                        onClick={() => {
                          setDeleteItem(brand);
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
          {brands?.meta && (
            <TablePagination
              component='div'
              count={brands?.meta?.totalCount || -1}
              onChangePage={handlePageChange}
              onChangeRowsPerPage={handleRowsPerPageChange}
              page={pageMeta.page - 1}
              rowsPerPage={pageMeta?.per_page}
              rowsPerPageOptions={[10, 25, 50, 100]}
            />
          )}
        </CardActions>
      </Card>

      <DeleteDialog
        title='brand'
        item={deleteItem?.name}
        handleDialogClose={handleDialogClose}
        dialogOpen={dialogOpen}
        onClick={() => {
          handleDialogClose();
          deleteBrandMutation.mutate(deleteItem.id);
        }}
      />

      <DeleteDialog
        title={`${selectedData.length} brands`}
        handleDialogClose={handleBulkDeleteDialogClose}
        dialogOpen={bulkDeleteDialogOpen}
        onClick={() => {
          handleBulkDeleteDialogClose();
          deleteBrandsMutation.mutate(selectedData, {
            onSuccess: () => setSelectedData([]),
          });
        }}
      />
    </>
  );
}

export default BrandsTable;
