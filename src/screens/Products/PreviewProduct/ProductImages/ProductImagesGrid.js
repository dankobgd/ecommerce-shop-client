import React, { useContext, useState } from 'react';

import { yupResolver } from '@hookform/resolvers';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  makeStyles,
  Typography,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import clsx from 'clsx';
import { FormProvider, useForm } from 'react-hook-form';
import * as Yup from 'yup';

import CustomTooltip from '../../../../components/CustomTooltip/CustomTooltip';
import { FormSubmitButton } from '../../../../components/Form';
import ErrorMessage from '../../../../components/Message/ErrorMessage';
import DeleteDialog from '../../../../components/TableComponents/DeleteDialog';
import { ToastContext } from '../../../../components/Toast/ToastContext';
import { useDeleteProductImage, useUpdateProductImage } from '../../../../hooks/queries/productQueries';
import { useFormServerErrors } from '../../../../hooks/useFormServerErrors';
import { rules } from '../../../../utils/validation';
import { ProductImageUploadField } from './ImageUploadField';

const useStyles = makeStyles(() => ({
  grid: {
    display: 'grid',
    justifyItems: 'space-between',
    gridTemplateColumns: 'repeat(auto-fit,minmax(270px, 1fr))',
    gridGap: '1rem',
  },
  wrapper: {
    width: 'auto',
    minHeight: '220px',
    maxHeight: '300px',
    position: 'relative',
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'opacity 0.35s',

    '&.hovered': {
      opacity: 0.7,
    },
  },
  editImage: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: '999px',
  },
  deleteImage: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: '999px',
  },
}));

const schema = Yup.object({
  image: rules.requiredImage,
});

const formOpts = {
  mode: 'onChange',
  reValidateMode: 'onChange',
  resolver: yupResolver(schema),
  defaultValues: {
    image: '',
  },
};

function ProductImagesGrid({ images, product }) {
  const classes = useStyles();
  const [isHover, setIsHover] = useState(null);
  const [editItem, setEditItem] = useState();
  const [deleteItem, setDeleteItem] = useState();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const toast = useContext(ToastContext);

  const methods = useForm(formOpts);
  const { handleSubmit, setError } = methods;

  const editProductImageMutation = useUpdateProductImage(product?.id?.toString(), editItem?.id);
  const deleteProductImageMutation = useDeleteProductImage();

  const handleEditModalOpen = () => {
    setEditModalOpen(true);
  };
  const handleEditModalClose = () => {
    setEditModalOpen(false);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };
  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const onMouseEnter = url => {
    setIsHover(url);
  };
  const onMouseLeave = () => {
    setIsHover(null);
  };

  const onSubmit = values => {
    const formData = new FormData();
    formData.append('image', values.image);
    editProductImageMutation.mutate(formData);
  };

  const onError = () => {
    toast.error('Form has errors, please check the details');
  };

  useFormServerErrors(editProductImageMutation?.error, setError);

  return (
    <>
      <div className={classes.grid}>
        {images?.map((image, idx) => (
          <div
            key={image.publicId || image.url}
            className={classes.wrapper}
            onMouseEnter={() => onMouseEnter(image.url)}
            onMouseLeave={onMouseLeave}
          >
            <img
              src={image.url}
              alt={`Product ${idx + 1}`}
              className={clsx(classes.img, isHover === image.url && 'hovered')}
            />

            {isHover === image.url && (
              <CustomTooltip title={<Typography color='inherit'>Edit Image</Typography>}>
                <div className={classes.editImage}>
                  <IconButton
                    color='primary'
                    onClick={() => {
                      setEditItem(image);
                      handleEditModalOpen();
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </div>
              </CustomTooltip>
            )}

            {isHover === image.url && (
              <CustomTooltip title={<Typography color='inherit'>Delete Image</Typography>}>
                <div className={classes.deleteImage}>
                  <IconButton
                    onClick={() => {
                      setDeleteItem(image);
                      handleDialogOpen();
                    }}
                  >
                    <DeleteIcon style={{ fill: 'red', fontSize: 32 }} />
                  </IconButton>
                </div>
              </CustomTooltip>
            )}
          </div>
        ))}
      </div>

      <Dialog open={editModalOpen} onClose={handleEditModalClose} aria-labelledby='edit-image-dialog'>
        <DialogTitle>Edit Image</DialogTitle>
        <DialogContent>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
              {editProductImageMutation?.isLoading && <CircularProgress />}
              {editProductImageMutation?.isError && <ErrorMessage message={editProductImageMutation.error.message} />}

              <ProductImageUploadField name='image' />

              <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
                <Button onClick={handleEditModalClose} color='primary'>
                  Cancel
                </Button>
                <FormSubmitButton loading={editProductImageMutation?.isLoading}>Update Image</FormSubmitButton>
              </div>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>

      <DeleteDialog
        title='image'
        handleDialogClose={handleDialogClose}
        dialogOpen={dialogOpen}
        onClick={() => {
          handleDialogClose();
          deleteProductImageMutation.mutate({ productId: product?.id?.toString(), imageId: deleteItem.id });
        }}
      />
    </>
  );
}

export default ProductImagesGrid;
