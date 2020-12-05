import React, { useContext } from 'react';

import { yupResolver } from '@hookform/resolvers';
import { Avatar, CircularProgress, Container, Typography } from '@material-ui/core';
import ClassIcon from '@material-ui/icons/Class';
import { makeStyles } from '@material-ui/styles';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation, useQueryCache } from 'react-query';
import * as Yup from 'yup';

import api from '../../../api';
import { FormTextField, FormSubmitButton } from '../../../components/Form';
import ErrorMessage from '../../../components/Message/ErrorMessage';
import { useFormServerErrors } from '../../../hooks/useFormServerErrors';
import { ToastContext } from '../../../store/toast/toast';
import { rules } from '../../../utils/validation';
import { BrandLogoUploadField } from './FileUploadInputs';

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
  description: Yup.string(),
  email: rules.email,
  logo: rules.requiredImage,
  websiteUrl: Yup.string().required(),
});

const formOpts = {
  mode: 'onChange',
  reValidateMode: 'onChange',
  defaultValues: {
    name: '',
    slug: '',
    type: '',
    description: '',
    email: '',
    logo: '',
    websiteUrl: '',
  },
  resolver: yupResolver(schema),
};

function CreateProductForm() {
  const classes = useStyles();
  const toast = useContext(ToastContext);
  const cache = useQueryCache();

  const methods = useForm(formOpts);
  const { handleSubmit, setError } = methods;

  const [createBrand, { isLoading, isError, error }] = useMutation(formData => api.brands.create(formData), {
    onMutate: formData => {
      cache.cancelQueries('brands');
      const previousValue = cache.getQueryData('brands');
      cache.setQueryData('brands', old => ({
        ...old,
        formData,
      }));
      return previousValue;
    },
    onSuccess: () => {
      toast.success('Brand created');
    },
    onError: (_, __, previousValue) => {
      cache.setQueryData('brands', previousValue);
      toast.error('Form has errors, please check the details');
    },
    onSettled: () => {
      cache.invalidateQueries('brands');
    },
  });

  const onSubmit = async values => {
    const { logo, ...rest } = values;
    const formData = new FormData();

    formData.append('logo', logo);
    Object.keys(rest).forEach(name => {
      formData.append(name, rest[name]);
    });

    await createBrand(formData);
  };

  const onError = () => {
    toast.error('Form has errors, please check the details');
  };

  useFormServerErrors(error, setError);

  return (
    <Container component='main' maxWidth='xs'>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <ClassIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Create Brand
        </Typography>

        {isLoading && <CircularProgress />}
        {isError && <ErrorMessage message={error.message} />}

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
            <FormTextField name='name' fullWidth />
            <FormTextField name='slug' fullWidth />
            <FormTextField name='type' fullWidth />
            <FormTextField name='description' fullWidth />
            <FormTextField name='email' fullWidth />
            <FormTextField name='websiteUrl' fullWidth />
            <BrandLogoUploadField name='logo' />

            <FormSubmitButton className={classes.submit} fullWidth loading={isLoading}>
              Add Brand
            </FormSubmitButton>
          </form>
        </FormProvider>
      </div>
    </Container>
  );
}

export default CreateProductForm;
