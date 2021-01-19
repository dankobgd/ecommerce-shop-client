import React, { useContext } from 'react';

import { yupResolver } from '@hookform/resolvers';
import { Avatar, CircularProgress, Container, Typography } from '@material-ui/core';
import ClassIcon from '@material-ui/icons/Class';
import { makeStyles } from '@material-ui/styles';
import { FormProvider, useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { FormTextField, FormSubmitButton } from '../../../components/Form';
import ErrorMessage from '../../../components/Message/ErrorMessage';
import { ToastContext } from '../../../components/Toast/ToastContext';
import { useCreateBrand } from '../../../hooks/queries/brandQueries';
import { useFormServerErrors } from '../../../hooks/useFormServerErrors';
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

  const methods = useForm(formOpts);
  const { handleSubmit, setError } = methods;

  const createBrandMutation = useCreateBrand();

  const onSubmit = values => {
    const { logo, ...rest } = values;
    const formData = new FormData();

    formData.append('logo', logo);
    Object.keys(rest).forEach(name => {
      formData.append(name, rest[name]);
    });

    createBrandMutation.mutate(formData);
  };

  const onError = () => {
    toast.error('Form has errors, please check the details');
  };

  useFormServerErrors(createBrandMutation?.error, setError);

  return (
    <Container component='main' maxWidth='xs'>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <ClassIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Create Brand
        </Typography>

        {createBrandMutation?.isLoading && <CircularProgress />}
        {createBrandMutation?.isError && <ErrorMessage message={createBrandMutation?.error?.message} />}

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
            <FormTextField name='name' fullWidth />
            <FormTextField name='slug' fullWidth />
            <FormTextField name='type' fullWidth />
            <FormTextField name='description' multiline fullWidth rows={5} />
            <FormTextField name='email' fullWidth />
            <FormTextField name='websiteUrl' fullWidth />
            <BrandLogoUploadField name='logo' />

            <FormSubmitButton className={classes.submit} fullWidth loading={createBrandMutation?.isLoading}>
              Add Brand
            </FormSubmitButton>
          </form>
        </FormProvider>
      </div>
    </Container>
  );
}

export default CreateProductForm;
