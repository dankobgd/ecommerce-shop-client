import React from 'react';

import { yupResolver } from '@hookform/resolvers';
import { Avatar, CircularProgress, Container, Typography } from '@material-ui/core';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import { makeStyles } from '@material-ui/styles';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

import {
  FormCheckbox,
  FormRadioGroup,
  FormSelect,
  FormTextField,
  FormSwitch,
  FormSlider,
  FormCheckboxGroup,
  FormSubmitButton,
  FormAutoComplete,
} from '../../../components/Form';
import ErrorMessage from '../../../components/Message/ErrorMessage';
import { useFormServerErrors } from '../../../hooks/useFormServerErrors';
import { productCreate } from '../../../store/products/productsSlice';
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
  gender: Yup.string().required(),
  locale: Yup.string().required(),
  isFeatured: Yup.boolean().test('test', 'lol', v => v !== false),
  isPublished: Yup.boolean().test('test', 'lol', v => v === false),
  priceRange: Yup.array().min(1).required(),
  colors: Yup.array().min(1).required(),
  tags: Yup.array().min(1).required(),
  multi: Yup.array().min(1).required(),
  country: Yup.object()
    .test('test', 'lol', v => Object.keys(v) !== 0)
    .required(),
});

const formOpts = {
  mode: 'onChange',
  reValidateMode: 'onChange',
  defaultValues: {
    name: '',
    gender: '',
    locale: '',
    isFeatured: false,
    isPublished: false,
    priceRange: [0, 5],
    colors: [],
    country: null,
    tags: [],
    multi: [],
  },
  resolver: yupResolver(schema),
};

function CreateProductForm() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const methods = useForm(formOpts);
  const { handleSubmit, setError, errors } = methods;
  const { loading, error } = useSelector(selectUIState(productCreate));

  const onSubmit = async data => {
    console.log(data);
    // dispatch(productCreate(data));
  };

  useFormServerErrors(error, setError);

  return (
    <Container component='main' maxWidth='xs'>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <ShoppingBasketIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Create Product
        </Typography>

        {loading && <CircularProgress />}
        {error && <ErrorMessage message={error.message} />}

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <section>
              <FormTextField name='name' />
            </section>

            <section>
              <FormSwitch name='isFeatured' />
            </section>

            <section>
              <FormCheckbox name='isPublished' />
            </section>

            <section>
              <FormSelect
                name='locale'
                options={[
                  { value: 'en', label: 'en' },
                  { value: 'sr', label: 'sr' },
                ]}
              />
            </section>

            <section>
              <FormRadioGroup
                name='gender'
                options={[
                  { value: 'm', label: 'male' },
                  { value: 'f', label: 'female' },
                ]}
              />
            </section>

            <section>
              <FormSlider name='priceRange' />
            </section>

            <section>
              <FormCheckboxGroup
                row
                name='colors'
                options={['red', 'green', 'blue', 'orange', 'pink', 'yellow', 'purple']}
              />
            </section>

            <section>
              <CountrySelect />
            </section>

            <section>
              <FormAutoComplete name='tags' multiple options={['winter', 'sports', 'men', 'women']} />
            </section>

            <section>
              <FormSelect
                name='multi'
                multiple
                options={[
                  { value: 'one', label: 'one' },
                  { value: 'two', label: 'two' },
                  { value: 'three', label: 'three' },
                  { value: 'four', label: 'four' },
                ]}
              />
            </section>

            <FormSubmitButton>Submit</FormSubmitButton>
          </form>
        </FormProvider>
      </div>
    </Container>
  );
}

function countryToFlag(isoCode) {
  return typeof String.fromCodePoint !== 'undefined'
    ? isoCode.toUpperCase().replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397))
    : isoCode;
}

function CountrySelect() {
  const getOptionSelected = (option, value) => option.code === value.code;
  const getOptionLabel = option => option.label;

  const renderOption = option => (
    <span>
      {countryToFlag(option.code)}
      {option.label} ({option.code}) +{option.phone}
    </span>
  );

  return (
    <section>
      <FormAutoComplete
        name='country'
        options={[
          { code: 'AD', label: 'Andorra', phone: '376' },
          { code: 'AE', label: 'United Arab Emirates', phone: '971' },
          { code: 'AF', label: 'Afghanistan', phone: '93' },
          { code: 'AG', label: 'Antigua and Barbuda', phone: '1-268' },
          { code: 'AI', label: 'Anguilla', phone: '1-264' },
          { code: 'AL', label: 'Albania', phone: '355' },
          { code: 'RS', label: 'Serbia', phone: '381' },
        ]}
        getOptionLabel={getOptionLabel}
        getOptionSelected={getOptionSelected}
        renderOption={renderOption}
      />
    </section>
  );
}

export default CreateProductForm;
