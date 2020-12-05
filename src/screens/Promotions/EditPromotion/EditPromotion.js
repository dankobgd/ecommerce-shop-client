import React, { useContext } from 'react';

import { yupResolver } from '@hookform/resolvers';
import { Avatar, CircularProgress, Container, Typography } from '@material-ui/core';
import LoyaltyIcon from '@material-ui/icons/Loyalty';
import { makeStyles } from '@material-ui/styles';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryCache } from 'react-query';
import * as Yup from 'yup';

import api from '../../../api';
import {
  FormTextField,
  FormSubmitButton,
  FormRadioGroup,
  FormDateTimePicker,
  FormNumberField,
} from '../../../components/Form';
import ErrorMessage from '../../../components/Message/ErrorMessage';
import { useFormServerErrors } from '../../../hooks/useFormServerErrors';
import { ToastContext } from '../../../store/toast/toast';
import { diff } from '../../../utils/diff';
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
  // promoCode: Yup.string().required(),
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

function EditPromotionForm({ promoCode }) {
  const classes = useStyles();
  const cache = useQueryCache();
  const toast = useContext(ToastContext);
  const [baseFormObj, setBaseFormObj] = React.useState({});

  const methods = useForm(formOpts);
  const { handleSubmit, setError, reset, watch } = methods;

  const { data: promotion } = useQuery(['promotions', promoCode], () => api.promotions.get(promoCode), {
    initialData: () => cache.getQueryData('promotions')?.data?.find(x => x.promoCode === promoCode),
  });

  const [editPromotion, { isLoading, isError, error }] = useMutation(
    ({ values }) => api.promotions.update(promoCode, values),
    {
      onMutate: values => {
        cache.cancelQueries(['promotions', promoCode]);
        const previousValue = cache.getQueryData(['promotions', promoCode]);
        cache.setQueryData(['promotions', promoCode], values);
        return previousValue;
      },
      onSuccess: () => {
        toast.success('Promo Code updated');
      },
      onError: (_, __, previousValue) => {
        cache.setQueryData(['promotions', promoCode], previousValue);
        toast.error('Form has errors, please check the details');
      },
      onSettled: () => {
        cache.invalidateQueries(['promotions', promoCode]);
      },
    }
  );

  const onSubmit = async values => {
    // because date is in different format so it looks like form has changed fields
    // so i convert all to iso string see if it has changed...
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
    const transformed = transformValuesToNumbers(values, ['amount']);

    if (Object.keys(changes).length === 0) {
      toast.info('No changes applied');
    }

    if (Object.keys(changes).length > 0) {
      await editPromotion({ code: promotion.promoCode, values: transformed });
    }
  };

  const onError = () => {
    toast.error('Form has errors, please check the details');
  };

  React.useEffect(() => {
    if (promotion) {
      // eslint-disable-next-line no-unused-vars
      const { amount, startsAt, endsAt, ...rest } = promotion;
      const obj = { ...rest, amount: amount?.toString() || '', startsAt, endsAt };

      setBaseFormObj(obj);
      reset(obj);
    }
  }, [promotion, reset]);

  useFormServerErrors(error, setError);

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

        {isLoading && <CircularProgress />}
        {isError && <ErrorMessage message={error.message} />}

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
            <FormTextField name='description' fullWidth />
            <FormDateTimePicker name='startsAt' fullWidth minutesStep={1} disablePast />
            <FormDateTimePicker name='endsAt' fullWidth minutesStep={1} disablePast />

            <FormSubmitButton className={classes.submit} fullWidth loading={isLoading}>
              Save Changes
            </FormSubmitButton>
          </form>
        </FormProvider>
      </div>
    </Container>
  );
}

export default EditPromotionForm;
