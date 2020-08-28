import React from 'react';

import { yupResolver } from '@hookform/resolvers';
import { Avatar, CircularProgress, Container, Typography } from '@material-ui/core';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import { makeStyles } from '@material-ui/styles';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

import {
  FormTextField,
  FormSwitch,
  FormSubmitButton,
  FormAutoComplete,
  FormNumberField,
} from '../../../components/Form';
import ErrorMessage from '../../../components/Message/ErrorMessage';
import { useFormServerErrors } from '../../../hooks/useFormServerErrors';
import { productCreate } from '../../../store/product/productSlice';
import { selectUIState } from '../../../store/ui';
import { transformKeysToSnakeCase } from '../../../utils/transformObjectKeys';
import { ProductImagesDropzone, ProductSingleUpload } from './FileUploadInputs';

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

const schema = Yup.object({});

const formOpts = {
  mode: 'onChange',
  reValidateMode: 'onChange',
  defaultValues: {
    brandId: '',
    categoryId: '',
    // discountId: '',
    name: '',
    slug: '',
    description: '',
    price: '',
    inStock: true,
    isFeatured: false,
    tags: [],
    image: '',
    images: [],
  },
  resolver: yupResolver(schema),
};

function CreateProductForm() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const methods = useForm(formOpts);
  const { handleSubmit, setError } = methods;
  const { loading, error } = useSelector(selectUIState(productCreate));

  const onSubmit = async data => {
    const { Brand, Category, tags, image, images, ...rest } = data;
    const formData = new FormData();
    const fields = transformKeysToSnakeCase(rest);

    formData.append('image', image);
    Object.keys(fields).forEach(name => {
      formData.append(name, fields[name]);
    });
    Object.keys(Brand).forEach(name => {
      formData.append(`Brand.${name}`, Brand[name]);
    });
    Object.keys(Category).forEach(name => {
      formData.append(`Category.${name}`, Category[name]);
    });
    Object.values(images).forEach(img => {
      formData.append('images', img);
    });
    tags.forEach(tag => {
      formData.append('tags', tag);
    });

    await dispatch(productCreate(formData));
  };

  useFormServerErrors(error, setError);

  return (
    <Container component='main' maxWidth='xs'>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <ShoppingBasketIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Create Product
        </Typography>

        {loading && <CircularProgress />}
        {error && <ErrorMessage message={error.message} />}

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FormTextField name='brandId' fullWidth />
            <FormTextField name='categoryId' fullWidth />
            {/* <FormTextField name='discountId' fullWidth /> */}
            <FormTextField name='name' fullWidth />
            <FormTextField name='slug' fullWidth />
            <FormTextField name='description' fullWidth />
            <FormNumberField name='price' fullWidth />
            <FormSwitch name='inStock' />
            <FormSwitch name='isFeatured' />
            <FormAutoComplete name='tags' multiple fullWidth options={['winter', 'sports', 'men', 'women']} />

            <ProductSingleUpload />
            <ProductImagesDropzone />

            <FormSubmitButton className={classes.submit} fullWidth>
              Add product
            </FormSubmitButton>
          </form>
        </FormProvider>
      </div>
    </Container>
  );
}

export default CreateProductForm;
