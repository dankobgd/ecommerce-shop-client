import React from 'react';

import { yupResolver } from '@hookform/resolvers';
import { Avatar, CircularProgress, Container, Typography } from '@material-ui/core';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import { makeStyles } from '@material-ui/styles';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

import { FormTextField, FormSubmitButton } from '../../../components/Form';
import ErrorMessage from '../../../components/Message/ErrorMessage';
import { useFormServerErrors } from '../../../hooks/useFormServerErrors';
import { brandUpdate, selectBrandById, selectSelectedId } from '../../../store/brand/brandSlice';
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
  name: Yup.string().required(),
  slug: Yup.string().required(),
  type: Yup.string().required(),
  description: Yup.string().required(),
  email: rules.emailRule,
  logo: Yup.string().required(),
  websiteUrl: Yup.string().required(),
});

const formOpts = brand => ({
  mode: 'onChange',
  reValidateMode: 'onChange',
  defaultValues: {
    name: brand?.name || '',
    slug: brand?.slug || '',
    type: brand?.type || '',
    email: brand?.email || '',
    description: brand?.description || '',
    websiteUrl: brand?.websiteUrl || '',
  },
  resolver: yupResolver(schema),
});

function EditBrandForm() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const selectedId = useSelector(selectSelectedId);
  const brand = useSelector(selectBrandById(selectedId));
  const methods = useForm(formOpts(brand));
  const { handleSubmit, setError } = methods;
  const { loading, error } = useSelector(selectUIState(brandUpdate));

  const onSubmit = async data => {
    await dispatch(brandUpdate({ id: brand.id, details: data }));
  };

  useFormServerErrors(error, setError);

  return (
    <Container component='main' maxWidth='xs'>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <ShoppingBasketIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Edit Brand
        </Typography>

        {loading && <CircularProgress />}
        {error && <ErrorMessage message={error.message} />}

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FormTextField name='name' fullWidth />
            <FormTextField name='slug' fullWidth />
            <FormTextField name='type' fullWidth />
            <FormTextField name='description' fullWidth />
            <FormTextField name='email' fullWidth />
            <FormTextField name='websiteUrl' fullWidth />
            <FormSubmitButton className={classes.submit} fullWidth>
              Save Changes
            </FormSubmitButton>
          </form>
        </FormProvider>
      </div>
    </Container>
  );
}

export default EditBrandForm;
