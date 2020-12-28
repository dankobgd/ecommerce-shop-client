import React, { useContext } from 'react';

import { yupResolver } from '@hookform/resolvers';
import { Avatar, CircularProgress, Container, Typography } from '@material-ui/core';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import { makeStyles } from '@material-ui/styles';
import { FormProvider, useForm } from 'react-hook-form';
import * as Yup from 'yup';

import {
  FormTextField,
  FormSubmitButton,
  FormNumberField,
  FormSwitch,
  FormAutoComplete,
  FormCheckbox,
} from '../../../components/Form';
import ErrorMessage from '../../../components/Message/ErrorMessage';
import { ToastContext } from '../../../components/Toast/ToastContext';
import { useBrands } from '../../../hooks/queries/brandQueries';
import { useCategories } from '../../../hooks/queries/categoryQueries';
import { useProduct, useUpdateProduct } from '../../../hooks/queries/productQueries';
import { useFormServerErrors } from '../../../hooks/useFormServerErrors';
import { diff } from '../../../utils/diff';
import { formatPriceForDisplay, priceToLowestCurrencyDenomination } from '../../../utils/priceFormat';
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
  brandId: Yup.object()
    .test('required', 'brand is a required field', value => !!value)
    .nullable(),
  categoryId: Yup.object()
    .test('required', 'category is a required field', value => !!value)
    .nullable(),
  name: Yup.string().required(),
  slug: Yup.string().required(),
  description: Yup.string(),
  price: Yup.string().required(),
  inStock: Yup.boolean().required(),
  isFeatured: Yup.boolean().required(),
  image: rules.optionalImage,
  // properties: rules.productProperties,
});

const formOpts = {
  mode: 'onChange',
  reValidateMode: 'onChange',
  defaultValues: {
    brandId: null,
    categoryId: null,
    name: '',
    slug: '',
    description: '',
    price: 50,
    image: '',
    inStock: false,
    isFeatured: false,
  },
  resolver: yupResolver(schema),
};

const renderPropertyInputType = property => {
  if (property.type === 'text') {
    return (
      <FormAutoComplete
        key={property.name}
        name={`properties.${property.name}`}
        label={property.label}
        options={property.choices}
        getOptionLabel={option => (option.name ? option.name : option) || ''}
        getOptionSelected={(option, value) => (option ? option.name === value.name : option === value || '')}
        fullWidth
      />
    );
  }
  // @TODO: init default form property vals to fix uncontroll field err
  if (property.type === 'bool') {
    return <FormCheckbox key={property.name} name={`properties.${property.name}`} label={property.label} fullWidth />;
  }
  return null;
};

const ProductProperties = ({ chosenCategory, product }) => {
  const cat = chosenCategory || product?.category;

  const properties = cat?.properties
    ? cat?.properties.filter(x => Boolean(x.filterable)).sort((a, b) => a.importance - b.importance)
    : [];

  return (
    properties.length > 0 && (
      <div style={{ marginTop: '1rem' }}>
        <Typography variant='subtitle1'>Properties</Typography>
        {properties.map(prop => renderPropertyInputType(prop))}
      </div>
    )
  );
};

function EditProductForm({ productId }) {
  const classes = useStyles();
  const toast = useContext(ToastContext);
  const [baseFormObj, setBaseFormObj] = React.useState({});

  const methods = useForm(formOpts);
  const { handleSubmit, setError, reset, watch } = methods;

  const { data: product } = useProduct(productId);
  const { data: brandsList } = useBrands();
  const { data: categoriesList } = useCategories();

  const editProductMutation = useUpdateProduct();

  const onSubmit = values => {
    const changes = diff(baseFormObj, values);
    const { image, ...rest } = changes;
    const formData = new FormData();

    rest.price = priceToLowestCurrencyDenomination(rest.price);

    if (image) {
      formData.append('image', image);
    }
    Object.keys(rest).forEach(name => {
      formData.append(name, rest[name]);
    });

    if (Object.keys(changes).length === 0) {
      toast.info('No changes applied');
    }
    if (Object.keys(changes).length > 0) {
      editProductMutation.mutate(product.id, formData);
    }
  };

  const onError = () => {
    toast.error('Form has errors, please check the details');
  };

  React.useEffect(() => {
    if (product) {
      // eslint-disable-next-line no-unused-vars
      const { image, ...rest } = product;
      const obj = { ...rest, image: '', price: 50 };

      setBaseFormObj(obj);
      reset(obj);
    }
  }, [product, reset]);

  useFormServerErrors(editProductMutation?.error, setError);

  const chosenCategory = watch('categoryId');

  return (
    <Container component='main' maxWidth='xs'>
      <pre>watch: {JSON.stringify(methods.watch(), null, 2)}</pre>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <ShoppingBasketIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Edit Product
        </Typography>

        {editProductMutation?.isLoading && <CircularProgress />}
        {editProductMutation?.isError && <ErrorMessage message={editProductMutation?.error?.message} />}

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
            <BrandDropdown fullWidth options={brandsList?.data ?? []} defaultValue={product?.brand || ''} />
            <CategoryDropdown fullWidth options={categoriesList?.data ?? []} defaultValue={product?.category || ''} />
            <FormTextField name='name' fullWidth />
            <FormTextField name='slug' fullWidth />
            <FormTextField name='description' fullWidth />
            <FormNumberField name='price' fullWidth prefix='$' />
            <FormSwitch name='inStock' />
            <FormSwitch name='isFeatured' />
            <ProductProperties chosenCategory={chosenCategory} product={product} />

            <FormSubmitButton className={classes.submit} fullWidth loading={editProductMutation?.isLoading}>
              Save Changes
            </FormSubmitButton>
          </form>
        </FormProvider>
      </div>
    </Container>
  );
}

const getOptionLabel = option => option.name || '';
const getOptionSelected = (option, value) => option.id === value.id;

const BrandDropdown = ({ options, ...rest }) => (
  <FormAutoComplete
    {...rest}
    name='brandId'
    label='Brand'
    options={options}
    getOptionLabel={getOptionLabel}
    getOptionSelected={getOptionSelected}
  />
);

const CategoryDropdown = ({ options, ...rest }) => (
  <FormAutoComplete
    {...rest}
    name='categoryId'
    label='Category'
    options={options}
    getOptionLabel={getOptionLabel}
    getOptionSelected={getOptionSelected}
  />
);

const TagsDropdown = ({ options, ...rest }) => (
  <FormAutoComplete
    {...rest}
    multiple
    name='tags'
    options={options}
    getOptionLabel={getOptionLabel}
    getOptionSelected={getOptionSelected}
  />
);

export default EditProductForm;
