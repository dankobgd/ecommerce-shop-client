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
import { tagUpdate, selectTagById, selectSelectedId } from '../../../store/tag/tagSlice';
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

const formOpts = tag => ({
  mode: 'onChange',
  reValidateMode: 'onChange',
  defaultValues: {
    name: tag?.name || '',
    slug: tag?.slug || '',
    description: tag?.description || '',
  },
  resolver: yupResolver(schema),
});

function EditTagForm() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const selectedId = useSelector(selectSelectedId);
  const tag = useSelector(selectTagById(selectedId));
  const methods = useForm(formOpts(tag));
  const { handleSubmit, setError } = methods;
  const { loading, error } = useSelector(selectUIState(tagUpdate));

  const onSubmit = async data => {
    await dispatch(tagUpdate({ id: tag.id, details: data }));
  };

  useFormServerErrors(error, setError);

  return (
    <Container component='main' maxWidth='xs'>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <ShoppingBasketIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Edit Tag
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

export default EditTagForm;
