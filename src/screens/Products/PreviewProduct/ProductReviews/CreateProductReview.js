import React, { useContext } from 'react';

import { yupResolver } from '@hookform/resolvers';
import { Avatar, CircularProgress, Container, Typography } from '@material-ui/core';
import RateReviewIcon from '@material-ui/icons/RateReview';
import { makeStyles } from '@material-ui/styles';
import { FormProvider, useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { FormTextField, FormSubmitButton, FormRating } from '../../../../components/Form';
import ErrorMessage from '../../../../components/Message/ErrorMessage';
import { ToastContext } from '../../../../components/Toast/ToastContext';
import { useCreateProductReview } from '../../../../hooks/queries/productQueries';
import { useFormServerErrors } from '../../../../hooks/useFormServerErrors';
import { rules } from '../../../../utils/validation';

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
  rating: rules.requiredPositiveNumber,
  title: Yup.string().required(),
  comment: Yup.string().required(),
});

const formOpts = {
  mode: 'onChange',
  reValidateMode: 'onChange',
  defaultValues: {
    rating: '',
    title: '',
    comment: '',
  },
  resolver: yupResolver(schema),
};

function CreateProductReviewForm({ productId }) {
  const classes = useStyles();
  const toast = useContext(ToastContext);

  const methods = useForm(formOpts);
  const { handleSubmit, setError } = methods;

  const createReviewMutation = useCreateProductReview(productId);

  const onSubmit = values => {
    createReviewMutation.mutate(values);
  };

  const onError = () => {
    toast.error('Form has errors, please check the details');
  };

  useFormServerErrors(createReviewMutation?.error, setError);

  return (
    <Container component='main' maxWidth='xs'>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <RateReviewIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Create Review
        </Typography>

        {createReviewMutation?.isLoading && <CircularProgress />}
        {createReviewMutation?.isError && <ErrorMessage message={createReviewMutation?.error?.message} />}

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
            <p style={{ marginBottom: 0, paddingBottom: 0 }}>rating</p>
            <FormRating name='rating' />
            <FormTextField name='title' fullWidth />
            <FormTextField name='comment' multiline fullWidth rows={5} />

            <FormSubmitButton className={classes.submit} fullWidth loading={createReviewMutation?.isLoading}>
              Add Review
            </FormSubmitButton>
          </form>
        </FormProvider>
      </div>
    </Container>
  );
}

export default CreateProductReviewForm;
