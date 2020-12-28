import React, { useContext } from 'react';

import { yupResolver } from '@hookform/resolvers';
import { Avatar, CircularProgress, Container, Typography } from '@material-ui/core';
import LoyaltyIcon from '@material-ui/icons/Loyalty';
import { makeStyles } from '@material-ui/styles';
import { FormProvider, useForm } from 'react-hook-form';
import * as Yup from 'yup';

import {
  FormTextField,
  FormSubmitButton,
  FormRadioGroup,
  FormDateTimePicker,
  FormNumberField,
} from '../../../components/Form';
import ErrorMessage from '../../../components/Message/ErrorMessage';
import { ToastContext } from '../../../components/Toast/ToastContext';
import { useCreatePromotion } from '../../../hooks/queries/promotionQueries';
import { useFormServerErrors } from '../../../hooks/useFormServerErrors';
import { transformValuesToNumbers } from '../../../utils/transformObjectKeys';
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
  promoCode: Yup.string().required(),
  type: Yup.string().required(),
  amount: Yup.string().required(),
  description: Yup.string(),
  startsAt: rules.startDate,
  endsAt: rules.endDate('startsAt'),
});

const formOpts = {
  mode: 'onChange',
  reValidateMode: 'onChange',
  defaultValues: {
    promoCode: '',
    type: '',
    amount: '',
    description: '',
    startsAt: null,
    endsAt: null,
  },
  resolver: yupResolver(schema),
};

function CreatePromotionForm() {
  const classes = useStyles();
  const toast = useContext(ToastContext);

  const methods = useForm(formOpts);
  const { handleSubmit, setError, watch } = methods;

  const createPromotionMutation = useCreatePromotion();

  const onSubmit = async data => {
    const transformed = transformValuesToNumbers(data, ['amount']);
    createPromotionMutation.mutate(transformed);
  };

  const onError = () => {
    toast.error('Form has errors, please check the details');
  };

  useFormServerErrors(createPromotionMutation?.error, setError);

  const isAllowedAmountValue = (values, type) => {
    const val = !type || type === 'fixed' ? 9999 : 100;
    return values.formattedValue === '' || values.floatValue <= val;
  };

  return (
    <Container component='main' maxWidth='xs'>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LoyaltyIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Create Promotion
        </Typography>

        {createPromotionMutation?.isLoading && <CircularProgress />}
        {createPromotionMutation?.isError && <ErrorMessage message={createPromotionMutation?.error?.message} />}

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
            <FormTextField name='promoCode' fullWidth />
            <FormRadioGroup
              row
              name='type'
              options={[
                { label: 'percentage', value: 'percentage' },
                { label: 'fixed', value: 'fixed' },
              ]}
            />
            <FormNumberField
              name='amount'
              fullWidth
              isAllowed={values => isAllowedAmountValue(values, watch('type'))}
            />
            <FormTextField name='description' fullWidth />

            <FormDateTimePicker name='startsAt' fullWidth minutesStep={1} disablePast />
            <FormDateTimePicker name='endsAt' fullWidth minutesStep={1} disablePast />

            <FormSubmitButton className={classes.submit} fullWidth loading={createPromotionMutation?.isLoading}>
              Create Promotion
            </FormSubmitButton>
          </form>
        </FormProvider>
      </div>
    </Container>
  );
}

export default CreatePromotionForm;
