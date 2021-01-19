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
import { useProductReview, useUpdateProductReview } from '../../../../hooks/queries/productQueries';
import { useFormServerErrors } from '../../../../hooks/useFormServerErrors';
import { diff, isEmptyObject } from '../../../../utils/diff';
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
  comment: Yup.string().required(),
  title: Yup.string().required(),
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

function EditProductReviewForm({ productId, reviewId }) {
  const classes = useStyles();
  const toast = useContext(ToastContext);
  const [baseFormObj, setBaseFormObj] = React.useState({});

  const methods = useForm(formOpts);
  const { handleSubmit, setError, reset } = methods;

  const { data: review } = useProductReview(productId, reviewId);

  const editProductReviewMutation = useUpdateProductReview(productId, reviewId);

  const onSubmit = values => {
    const changes = diff(baseFormObj, values);

    if (isEmptyObject(changes)) {
      toast.info('No changes applied');
    }
    if (!isEmptyObject(changes)) {
      editProductReviewMutation.mutate(changes);
    }
  };

  const onError = () => {
    toast.error('Form has errors, please check the details');
  };

  React.useEffect(() => {
    if (review) {
      setBaseFormObj(review);
      reset(review);
    }
  }, [review, reset]);

  useFormServerErrors(editProductReviewMutation?.error, setError);

  return (
    <Container component='main' maxWidth='xs'>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <RateReviewIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Edit Review
        </Typography>

        {editProductReviewMutation?.isLoading && <CircularProgress />}
        {editProductReviewMutation?.isError && <ErrorMessage message={editProductReviewMutation?.error?.message} />}

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
            <FormTextField name='productId' fullWidth inputProps={{ readOnly: true }} disabled />
            <FormTextField name='id' label='Review Id' fullWidth inputProps={{ readOnly: true }} disabled />

            <p style={{ marginBottom: 0, paddingBottom: 0 }}>rating</p>
            <FormRating name='rating' />
            <FormTextField name='title' fullWidth />
            <FormTextField name='comment' multiline fullWidth rows={5} />

            <FormSubmitButton className={classes.submit} fullWidth loading={editProductReviewMutation?.isLoading}>
              Save Changes
            </FormSubmitButton>
          </form>
        </FormProvider>
      </div>
    </Container>
  );
}

export default EditProductReviewForm;
