import React, { useState } from 'react';

import {
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Button,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';

import DeleteDialog from '../../../components/TableComponents/DeleteDialog';
import { DeleteButton, EditButton, PreviewButton } from '../../../components/TableComponents/TableButtons';
import { useDeletePromotion, useDeletePromotions, usePromotions } from '../../../hooks/queries/promotionQueries';
import { diff } from '../../../utils/diff';
import { formatDate } from '../../../utils/formatDate';
import { getPersistedPagination, paginationRanges, persistPagination } from '../../../utils/pagination';
import { formatPriceForDisplay } from '../../../utils/priceFormat';

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

const PromotionsTable = ({ className, ...rest }) => {
  const classes = useStyles();
  const [pageMeta, setPageMeta] = useState(getPersistedPagination('promotions'));
  const { data: promotions } = usePromotions(pageMeta, { keepPreviousData: true });
  const deletePromotionMutation = useDeletePromotion();
  const deletePromotionsMutation = useDeletePromotions();

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
    const selected = event.target.checked ? promotions?.data?.map(x => x.promoCode) : [];
    setSelectedData(selected);
  };

  const handleSelectOne = (event, code) => {
    const selectedIndex = selectedData.indexOf(code);
    let newSelectedData = [];

    if (selectedIndex === -1) {
      newSelectedData = newSelectedData.concat(selectedData, code);
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
    const params = { page: page + 1, per_page: promotions?.meta?.perPage };
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
    persistPagination('promotions', pageMeta);
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
              Delete {selectedData.length} promotions
            </Button>
          )}
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding='checkbox'>
                    <Checkbox
                      checked={selectedData?.length === promotions?.data?.length}
                      color='primary'
                      indeterminate={selectedData?.length > 0 && selectedData?.length < promotions?.data?.length}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>PromoCode</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Starts at</TableCell>
                  <TableCell>Ends at</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {promotions?.data?.map(promotion => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={promotion.promoCode}
                    selected={selectedData.indexOf(promotion.promoCode) !== -1}
                  >
                    <TableCell padding='checkbox'>
                      <Checkbox
                        checked={selectedData.indexOf(promotion.promoCode) !== -1}
                        color='primary'
                        onChange={event => handleSelectOne(event, promotion.promoCode)}
                        value='true'
                      />
                    </TableCell>
                    <TableCell>{promotion.promoCode}</TableCell>
                    <TableCell>
                      <Chip
                        label={promotion.type}
                        style={{ background: promotion.type === 'fixed' ? '#5b5bd6' : '#9a2424', color: '#fff' }}
                      />
                    </TableCell>
                    <TableCell>
                      {promotion.type === 'percentage' ? (
                        <Chip label={`${promotion.amount}%`} style={{ background: 'green', color: '#fff' }} />
                      ) : (
                        <Chip
                          label={`$${formatPriceForDisplay(promotion.amount)}`}
                          style={{ background: 'green', color: '#fff' }}
                        />
                      )}
                    </TableCell>
                    <TableCell>{promotion.description}</TableCell>
                    <TableCell>{formatDate(promotion.startsAt)}</TableCell>
                    <TableCell>{formatDate(promotion.endsAt)}</TableCell>
                    <TableCell>
                      <PreviewButton to={`${promotion.promoCode}/preview`} />
                    </TableCell>
                    <TableCell>
                      <EditButton to={`${promotion.promoCode}/edit`} />
                    </TableCell>
                    <TableCell>
                      <DeleteButton
                        onClick={() => {
                          setDeleteItem(promotion);
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
          {promotions?.meta && (
            <TablePagination
              component='div'
              count={promotions?.meta?.totalCount || -1}
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
        title='promotion'
        item={deleteItem?.promoCode}
        handleDialogClose={handleDialogClose}
        dialogOpen={dialogOpen}
        onClick={() => {
          handleDialogClose();
          deletePromotionMutation.mutate(deleteItem.promoCode);
        }}
      />

      <DeleteDialog
        title={`${selectedData.length} promotions`}
        handleDialogClose={handleBulkDeleteDialogClose}
        dialogOpen={bulkDeleteDialogOpen}
        onClick={() => {
          handleBulkDeleteDialogClose();
          deletePromotionsMutation.mutate(selectedData, {
            onSuccess: () => setSelectedData([]),
          });
        }}
      />
    </>
  );
};

export default PromotionsTable;
