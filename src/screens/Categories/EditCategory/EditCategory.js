import React from 'react';

import { yupResolver } from '@hookform/resolvers';
import { Avatar, CircularProgress, Container, Typography } from '@material-ui/core';
import CategoryIcon from '@material-ui/icons/Category';
import { makeStyles } from '@material-ui/styles';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

import { FormTextField, FormSubmitButton } from '../../../components/Form';
import ErrorMessage from '../../../components/Message/ErrorMessage';
import { useFormServerErrors } from '../../../hooks/useFormServerErrors';
import { categoryUpdate, selectCurrentEditCategory } from '../../../store/category/categorySlice';
import { selectUIState } from '../../../store/ui';

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
  description: Yup.string().required(),
});

const formOpts = category => ({
  mode: 'onChange',
  reValidateMode: 'onChange',
  defaultValues: {
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || '',
  },
  resolver: yupResolver(schema),
});

function EditCategoryForm() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const category = useSelector(selectCurrentEditCategory);
  const methods = useForm(formOpts(category));
  const { handleSubmit, setError } = methods;
  const { loading, error } = useSelector(selectUIState(categoryUpdate));

  const onSubmit = async data => {
    await dispatch(categoryUpdate({ id: category.id, details: data }));
  };

  useFormServerErrors(error, setError);

  return (
    <Container component='main' maxWidth='xs'>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <CategoryIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Edit Category
        </Typography>

        {loading && <CircularProgress />}
        {error && <ErrorMessage message={error.message} />}

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FormTextField name='name' fullWidth />
            <FormTextField name='slug' fullWidth />
            <FormTextField name='description' fullWidth />
            <FormSubmitButton className={classes.submit} fullWidth>
              Save Changes
            </FormSubmitButton>
          </form>
        </FormProvider>
      </div>
    </Container>
  );
}

export default EditCategoryForm;
