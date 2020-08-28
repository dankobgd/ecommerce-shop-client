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
  FormSubmitButton,
  FormNumberField,
  FormSwitch,
  FormAutoComplete,
} from '../../../components/Form';
import ErrorMessage from '../../../components/Message/ErrorMessage';
import { useFormServerErrors } from '../../../hooks/useFormServerErrors';
import { productCreate, selectSelectedId, selectProductById } from '../../../store/product/productSlice';
import { selectUIState } from '../../../store/ui';
import { rules } from '../../../utils/validation';

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
  email: rules.emailRule,
  password: rules.passwordRule,
});

const formOpts = product => ({
  mode: 'onChange',
  reValidateMode: 'onChange',
  defaultValues: {
    brandId: product?.brandId || '',
    categoryId: product?.categoryId || '',
    // discountId: product?.discountId || '',
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    price: product?.price || '',
    inStock: product?.inStock || false,
    isFeatured: product?.isFeatured || false,
    tags: product?.tags || [],
  },
  resolver: yupResolver(schema),
});

function EditProductForm() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const selectedId = useSelector(selectSelectedId);
  const product = useSelector(selectProductById(selectedId));
  const methods = useForm(formOpts(product));
  const { handleSubmit, setError } = methods;
  const { loading, error } = useSelector(selectUIState(productCreate));

  const onSubmit = async data => {
    dispatch(productCreate(data));
  };

  useFormServerErrors(error, setError);

  return (
    <Container component='main' maxWidth='xs'>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <ShoppingBasketIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Edit Product
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

            <FormSubmitButton className={classes.submit} fullWidth>
              Save Changes
            </FormSubmitButton>
          </form>
        </FormProvider>
      </div>
    </Container>
  );
}

export default EditProductForm;
