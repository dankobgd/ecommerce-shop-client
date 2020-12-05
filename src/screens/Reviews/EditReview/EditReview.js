import React, { useContext } from 'react';

import { yupResolver } from '@hookform/resolvers';
import { Avatar, CircularProgress, Container, Typography } from '@material-ui/core';
import RateReviewIcon from '@material-ui/icons/RateReview';
import { makeStyles } from '@material-ui/styles';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryCache } from 'react-query';
import * as Yup from 'yup';

import api from '../../../api';
import { FormTextField, FormSubmitButton, FormRadioGroup } from '../../../components/Form';
import ErrorMessage from '../../../components/Message/ErrorMessage';
import { useFormServerErrors } from '../../../hooks/useFormServerErrors';
import { ToastContext } from '../../../store/toast/toast';
import { diff } from '../../../utils/diff';

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
  rating: Yup.number().required(),
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

function EditReviewForm({ reviewId }) {
  const classes = useStyles();
  const cache = useQueryCache();
  const toast = useContext(ToastContext);
  const [baseFormObj, setBaseFormObj] = React.useState({});

  const methods = useForm(formOpts);
  const { handleSubmit, setError, reset } = methods;

  const { data: review } = useQuery(['reviews', reviewId], () => api.reviews.get(reviewId), {
    initialData: () => cache.getQueryData('reviews')?.data?.find(x => x.id === reviewId),
  });

  const [editReview, { isLoading, isError, error }] = useMutation(({ id, values }) => api.reviews.update(id, values), {
    onMutate: values => {
      cache.cancelQueries(['reviews', reviewId]);
      const previousValue = cache.getQueryData(['reviews', reviewId]);
      cache.setQueryData(['reviews', reviewId], values);
      return previousValue;
    },
    onSuccess: () => {
      toast.success('Review updated');
    },
    onError: (_, __, previousValue) => {
      cache.setQueryData(['reviews', reviewId], previousValue);
      toast.error('Form has errors, please check the details');
    },
    onSettled: () => {
      cache.invalidateQueries(['reviews', reviewId]);
    },
  });

  const onSubmit = async values => {
    const changes = diff(baseFormObj, values);

    if (Object.keys(changes).length === 0) {
      toast.info('No changes applied');
    }

    if (Object.keys(changes).length > 0) {
      const obj = {
        ...values,
        rating: Number.parseInt(values.rating, 10),
      };

      await editReview({ id: review.id, values: obj });
    }
  };

  const onError = () => {
    toast.error('Form has errors, please check the details');
  };

  React.useEffect(() => {
    if (review) {
      const obj = {
        ...review,
        rating: review?.rating?.toString() || '',
      };

      setBaseFormObj(obj);
      reset(obj);
    }
  }, [review, reset]);

  useFormServerErrors(error, setError);

  return (
    <Container component='main' maxWidth='xs'>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <RateReviewIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Edit Review
        </Typography>

        {isLoading && <CircularProgress />}
        {isError && <ErrorMessage message={error.message} />}

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
            <FormTextField name='id' fullWidth inputProps={{ readOnly: true }} disabled />
            <FormTextField name='productId' fullWidth inputProps={{ readOnly: true }} disabled />

            <p style={{ marginBottom: 0, paddingBottom: 0 }}>rating</p>
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
              Save Changes
            </FormSubmitButton>
          </form>
        </FormProvider>
      </div>
    </Container>
  );
}

export default EditReviewForm;
