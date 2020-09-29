import React from 'react';

import { yupResolver } from '@hookform/resolvers';
import { Avatar, CircularProgress, Container, Typography } from '@material-ui/core';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import { makeStyles } from '@material-ui/styles';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

import { FormTextField, FormSubmitButton, FormRadioGroup } from '../../../components/Form';
import ErrorMessage from '../../../components/Message/ErrorMessage';
import { useFormServerErrors } from '../../../hooks/useFormServerErrors';
import { reviewUpdate, selectCurrentEditReview } from '../../../store/review/reviewSlice';
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
  rating: Yup.number().required(),
  comment: Yup.string().required(),
});

const formOpts = review => ({
  mode: 'onChange',
  reValidateMode: 'onChange',
  defaultValues: {
    rating: review?.rating.toString() || '',
    comment: review?.comment || '',
  },
  resolver: yupResolver(schema),
});

function EditReviewForm() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const review = useSelector(selectCurrentEditReview);
  const methods = useForm(formOpts(review));
  const { handleSubmit, setError } = methods;
  const { loading, error } = useSelector(selectUIState(reviewUpdate));

  const onSubmit = async data => {
    data.rating = Number.parseInt(data.rating, 10);
    await dispatch(reviewUpdate({ id: review.id, details: data }));
  };

  useFormServerErrors(error, setError);

  return (
    <Container component='main' maxWidth='xs'>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <ShoppingBasketIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Edit Review
        </Typography>

        {loading && <CircularProgress />}
        {error && <ErrorMessage message={error.message} />}

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
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
            <FormTextField name='comment' multiline rowsMax={6} fullWidth />

            <FormSubmitButton className={classes.submit} fullWidth>
              Save Changes
            </FormSubmitButton>
          </form>
        </FormProvider>
      </div>
    </Container>
  );
}

export default EditReviewForm;
