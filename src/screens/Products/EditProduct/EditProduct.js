import React from 'react';

import { yupResolver } from '@hookform/resolvers';
import { Avatar, CircularProgress, Container, Typography } from '@material-ui/core';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import { makeStyles } from '@material-ui/styles';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

import {
  FormTextField,
  FormSubmitButton,
  FormNumberField,
  FormSwitch,
  FormAutoComplete,
} from '../../../components/Form';
import ErrorMessage from '../../../components/Message/ErrorMessage';
import { useFormServerErrors } from '../../../hooks/useFormServerErrors';
import { selectAllBrands, brandGetAll } from '../../../store/brand/brandSlice';
import { selectAllCategories, categoryGetAll } from '../../../store/category/categorySlice';
import { productCreate, selectCurrentEditProduct } from '../../../store/product/productSlice';
import { selectAllTags, tagGetAll, selectManyTags, tagGetAllForProduct } from '../../../store/tag/tagSlice';
import { selectUIState } from '../../../store/ui';
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
  email: rules.emailRule,
  password: rules.passwordRule,
});

const formOpts = product => ({
  mode: 'onChange',
  reValidateMode: 'onChange',
  defaultValues: {
    // discountId: product?.discountId || null,
    brandId: product?.brand || null,
    categoryId: product?.category || null,
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    price: product?.price || '',
    inStock: product?.inStock || false,
    isFeatured: product?.isFeatured || false,
    tags: [],
  },
  resolver: yupResolver(schema),
});

function EditProductForm() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const tagList = useSelector(selectAllTags);
  const brandList = useSelector(selectAllBrands);
  const categoryList = useSelector(selectAllCategories);
  const product = useSelector(selectCurrentEditProduct);
  const { loading, error } = useSelector(selectUIState(productCreate));
  const tags = useSelector(selectManyTags(product?.tags || []));

  const methods = useForm(formOpts(product));
  const { handleSubmit, setError } = methods;

  React.useEffect(() => {
    dispatch(tagGetAllForProduct(product.id));
    dispatch(brandGetAll());
    dispatch(categoryGetAll());
    dispatch(tagGetAll());
  }, [dispatch, product.id]);

  React.useEffect(() => {
    methods.setValue('tags', tags);
  }, [methods, tags]);

  const onSubmit = async data => {
    dispatch(productCreate(data));
  };

  useFormServerErrors(error, setError);

  return (
    <Container component='main' maxWidth='xs'>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <ShoppingBasketIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Edit Product
        </Typography>

        {loading && <CircularProgress />}
        {error && <ErrorMessage message={error.message} />}

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <BrandDropdown fullWidth options={brandList} />
            <CategoryDropdown fullWidth options={categoryList} />
            <FormTextField name='name' fullWidth />
            <FormTextField name='slug' fullWidth />
            <FormTextField name='description' fullWidth />
            <FormNumberField name='price' fullWidth prefix='$' />
            <FormSwitch name='inStock' />
            <FormSwitch name='isFeatured' />
            <TagsDropdown fullWidth options={tagList} />

            <FormSubmitButton className={classes.submit} fullWidth>
              Save Changes
            </FormSubmitButton>
          </form>
        </FormProvider>
      </div>
    </Container>
  );
}

const BrandDropdown = ({ options, ...rest }) => {
  const getOptionLabel = option => option.name || '';
  const getOptionSelected = (option, value) => option.id === value.id;

  return (
    <FormAutoComplete
      {...rest}
      name='brandId'
      label='Brand'
      options={options}
      getOptionLabel={getOptionLabel}
      getOptionSelected={getOptionSelected}
    />
  );
};

const CategoryDropdown = ({ options, ...rest }) => {
  const getOptionLabel = option => option.name || '';
  const getOptionSelected = (option, value) => option.id === value.id;

  return (
    <FormAutoComplete
      {...rest}
      name='categoryId'
      label='Category'
      options={options}
      getOptionLabel={getOptionLabel}
      getOptionSelected={getOptionSelected}
    />
  );
};
const TagsDropdown = ({ options, ...rest }) => {
  const getOptionLabel = option => option.name || '';
  const getOptionSelected = (option, value) => option.id === value.id;

  return (
    <FormAutoComplete
      {...rest}
      multiple
      name='tags'
      options={options}
      getOptionLabel={getOptionLabel}
      getOptionSelected={getOptionSelected}
    />
  );
};

export default EditProductForm;
