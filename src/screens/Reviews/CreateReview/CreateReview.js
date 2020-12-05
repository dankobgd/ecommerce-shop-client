import React, { useContext } from 'react';

import { yupResolver } from '@hookform/resolvers';
import { Avatar, CircularProgress, Container, Typography } from '@material-ui/core';
import RateReviewIcon from '@material-ui/icons/RateReview';
import { makeStyles } from '@material-ui/styles';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation, useQueryCache } from 'react-query';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';

import api from '../../../api';
import { FormTextField, FormSubmitButton, FormRadioGroup } from '../../../components/Form';
import ErrorMessage from '../../../components/Message/ErrorMessage';
import { useFormServerErrors } from '../../../hooks/useFormServerErrors';
import { ToastContext } from '../../../store/toast/toast';
import { selectUserProfile } from '../../../store/user/userSlice';

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
  productId: Yup.string().required(),
  rating: Yup.string().required(),
  title: Yup.string().required(),
  comment: Yup.string().required(),
});

const formOpts = {
  mode: 'onChange',
  reValidateMode: 'onChange',
  defaultValues: {
    productId: '',
    rating: '',
    title: '',
    comment: '',
  },
  resolver: yupResolver(schema),
};

function CreateReviewForm() {
  const classes = useStyles();
  const toast = useContext(ToastContext);
  const cache = useQueryCache();

  const methods = useForm(formOpts);
  const { handleSubmit, setError } = methods;

  // @TODO remove this
  const user = useSelector(selectUserProfile);

  const [createReview, { isLoading, isError, error }] = useMutation(values => api.reviews.create(values), {
    onMutate: formData => {
      cache.cancelQueries('reviews');
      const previousValue = cache.getQueryData('reviews');
      cache.setQueryData('reviews', old => ({
        ...old,
        formData,
      }));
      return previousValue;
    },
    onSuccess: () => {
      toast.success('Review created');
    },
    onError: (_, __, previousValue) => {
      cache.setQueryData('reviews', previousValue);
      toast.error('Form has errors, please check the details');
    },
    onSettled: () => {
      cache.invalidateQueries('reviews');
    },
  });

  const onSubmit = async values => {
    const obj = {
      ...values,
      rating: Number.parseInt(values.rating, 10),
      productId: Number.parseInt(values.productId, 10),
      user_id: user.id,
    };

    await createReview(obj);
  };

  const onError = () => {
    toast.error('Form has errors, please check the details');
  };

  useFormServerErrors(error, setError);

  return (
    <Container component='main' maxWidth='xs'>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <RateReviewIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Create Review
        </Typography>

        {isLoading && <CircularProgress />}
        {isError && <ErrorMessage message={error.message} />}

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
            <p style={{ marginBottom: 0, paddingBottom: 0 }}>rating</p>
            <FormTextField name='productId' fullWidth />
            <FormRadioGroup
              row
              name='rating'
              options={[
                { label: '1', value: '1' },
                { label: '2', value: '2' },
                { label: '3', value: '3' },
                { label: '4', value: '4' },
                { label: '5', value: '5' },
              ]}
            />
            <FormTextField name='title' fullWidth />
            <FormTextField name='comment' multiline rowsMax={6} fullWidth />

            <FormSubmitButton className={classes.submit} fullWidth loading={isLoading}>
              Add Review
            </FormSubmitButton>
          </form>
        </FormProvider>
      </div>
    </Container>
  );
}

export default CreateReviewForm;
