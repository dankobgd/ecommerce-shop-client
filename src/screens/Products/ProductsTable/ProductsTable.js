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
  Chip,
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';

import DeleteDialog from '../../../components/TableComponents/DeleteDialog';
import { DeleteButton, EditButton, PreviewButton } from '../../../components/TableComponents/TableButtons';
import { useDeleteProduct, useProducts } from '../../../hooks/queries/productQueries';
import { diff } from '../../../utils/diff';
import { formatDate } from '../../../utils/formatDate';
import { persistPagination, getPersistedPagination, paginationRanges } from '../../../utils/pagination';
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

const ProductsTable = ({ className, ...rest }) => {
  const classes = useStyles();
  const [pageMeta, setPageMeta] = useState(getPersistedPagination('products'));
  const { data: products } = useProducts(pageMeta, { keepPreviousData: true });
  const deleteProductMutation = useDeleteProduct();

  const [deleteItem, setDeleteItem] = useState();
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
    const params = { page: page + 1, per_page: products?.meta?.perPage };
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
    persistPagination('products', pageMeta);
  }, [pageMeta]);

  return (
    <>
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
                {products?.data?.map(product => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={product.id}
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
                    <TableCell>
                      <Chip
                        label={`$${formatPriceForDisplay(product.price)}`}
                        style={{ background: 'green', color: '#fff' }}
                      />
                    </TableCell>
                    <TableCell>{truncateText(product.description, 50)}</TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>
                      {product.isFeatured ? (
                        <CheckIcon style={{ fill: 'green' }} />
                      ) : (
                        <CloseIcon style={{ fill: 'red' }} />
                      )}
                    </TableCell>
                    <TableCell>
                      {product.inStock ? (
                        <CheckIcon style={{ fill: 'green' }} />
                      ) : (
                        <CloseIcon style={{ fill: 'red' }} />
                      )}
                    </TableCell>
                    <TableCell>{product.imageUrl}</TableCell>
                    <TableCell>{formatDate(product.createdAt)}</TableCell>
                    <TableCell>{formatDate(product.updatedAt)}</TableCell>
                    <TableCell>
                      <PreviewButton to={`${product.id}/${product.slug}/preview`} />
                    </TableCell>
                    <TableCell>
                      <EditButton to={`${product.id}/${product.slug}/edit`} />
                    </TableCell>
                    <TableCell>
                      <DeleteButton
                        onClick={() => {
                          setDeleteItem(product);
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
          {products?.meta && (
            <TablePagination
              component='div'
              count={products?.meta?.totalCount || -1}
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
        title='product'
        item={deleteItem?.name}
        handleDialogClose={handleDialogClose}
        dialogOpen={dialogOpen}
        onClick={() => {
          handleDialogClose();
          deleteProductMutation.mutate(deleteItem.id);
        }}
      />
    </>
  );
};

export default ProductsTable;
