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
import { usePromotion, useUpdatePromotion } from '../../../hooks/queries/promotionQueries';
import { useFormServerErrors } from '../../../hooks/useFormServerErrors';
import { diff, isEmptyObject } from '../../../utils/diff';
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
  type: Yup.string().required(),
  amount: rules.requiredPositiveNumber,
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

function EditPromotionForm({ promoCode }) {
  const classes = useStyles();
  const toast = useContext(ToastContext);
  const [baseFormObj, setBaseFormObj] = React.useState({});

  const methods = useForm(formOpts);
  const { handleSubmit, setError, reset, watch } = methods;

  const { data: promotion } = usePromotion(promoCode);

  const editPromotionMutation = useUpdatePromotion(promoCode);

  const onSubmit = values => {
    // i convert all dates to iso to check deep equal for changed data
    // because returned data from server is iso string and form contains date object...
    const base = {
      ...baseFormObj,
      startsAt: new Date(baseFormObj.startsAt).toISOString(),
      endsAt: new Date(baseFormObj.endsAt).toISOString(),
    };
    const vals = {
      ...values,
      startsAt: new Date(values.startsAt).toISOString(),
      endsAt: new Date(values.endsAt).toISOString(),
    };

    const changes = diff(base, vals);

    if (isEmptyObject(changes)) {
      toast.info('No changes applied');
    }
    if (!isEmptyObject(changes)) {
      editPromotionMutation.mutate({ code: promotion.promoCode, values: changes });
    }
  };

  const onError = () => {
    toast.error('Form has errors, please check the details');
  };

  React.useEffect(() => {
    if (promotion) {
      setBaseFormObj(promotion);
      reset(promotion);
    }
  }, [promotion, reset]);

  useFormServerErrors(editPromotionMutation?.error, setError);

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
          Edit Promotion
        </Typography>

        {editPromotionMutation?.isLoading && <CircularProgress />}
        {editPromotionMutation?.isError && <ErrorMessage message={editPromotionMutation?.error?.message} />}

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
            <FormTextField name='promoCode' fullWidth inputProps={{ readOnly: true }} disabled />
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
            <FormTextField name='description' multiline fullWidth rows={5} />
            <FormDateTimePicker name='startsAt' fullWidth minutesStep={1} disablePast />
            <FormDateTimePicker name='endsAt' fullWidth minutesStep={1} disablePast />

            <FormSubmitButton className={classes.submit} fullWidth loading={editPromotionMutation?.isLoading}>
              Save Changes
            </FormSubmitButton>
          </form>
        </FormProvider>
      </div>
    </Container>
  );
}

export default EditPromotionForm;
