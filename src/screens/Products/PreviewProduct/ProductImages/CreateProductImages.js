import React, { useContext } from 'react';

import { yupResolver } from '@hookform/resolvers';
import { Avatar, CircularProgress, Container, Typography } from '@material-ui/core';
import ImageIcon from '@material-ui/icons/Image';
import { makeStyles } from '@material-ui/styles';
import { FormProvider, useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { FormSubmitButton } from '../../../../components/Form';
import ErrorMessage from '../../../../components/Message/ErrorMessage';
import { ToastContext } from '../../../../components/Toast/ToastContext';
import { useCreateProductImages } from '../../../../hooks/queries/productQueries';
import { useFormServerErrors } from '../../../../hooks/useFormServerErrors';
import { rules } from '../../../../utils/validation';
import { ProductImagesDropzoneField } from './ImagesUploadInput';

const useStyles = makeStyles(theme => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const schema = Yup.object({
  images: rules.requiredImagesList,
});

const formOpts = {
  mode: 'onChange',
  reValidateMode: 'onChange',
  defaultValues: {
    images: [],
  },
  resolver: yupResolver(schema),
};

function CreateProductImages({ productId }) {
  const classes = useStyles();
  const toast = useContext(ToastContext);

  const methods = useForm(formOpts);
  const { handleSubmit, setError, reset } = methods;

  const createProductImagesMutation = useCreateProductImages(productId);

  const onSubmit = values => {
    const formData = new FormData();

    values.images.forEach(img => {
      formData.append('images', img);
    });

    createProductImagesMutation.mutate(formData, {
      onSuccess: () => reset({ images: [] }),
    });
  };

  const onError = () => {
    toast.error('Form has errors, please check the details');
  };

  useFormServerErrors(createProductImagesMutation?.error, setError);

  return (
    <Container component='main' maxWidth='xs'>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <ImageIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Create Images
        </Typography>

        {createProductImagesMutation?.isLoading && <CircularProgress />}
        {createProductImagesMutation?.isError && <ErrorMessage message={createProductImagesMutation?.error?.message} />}

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit, onError)} noValidate className={classes.form}>
            <ProductImagesDropzoneField name='images' />

            <FormSubmitButton className={classes.submit} fullWidth loading={createProductImagesMutation?.isLoading}>
              Add Images
            </FormSubmitButton>
          </form>
        </FormProvider>
      </div>
    </Container>
  );
}

export default CreateProductImages;
