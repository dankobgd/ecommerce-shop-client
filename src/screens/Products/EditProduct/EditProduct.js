import React, { useContext } from 'react';

import { yupResolver } from '@hookform/resolvers';
import { Avatar, CircularProgress, Container, Typography } from '@material-ui/core';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import { makeStyles } from '@material-ui/styles';
import _ from 'lodash';
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
import { isEmptyObject, diff } from '../../../utils/diff';
import { formatPriceForDisplay, priceToLowestCurrencyDenomination } from '../../../utils/priceFormat';
import { transformKeysToSnakeCase } from '../../../utils/transformObjectKeys';
import { rules } from '../../../utils/validation';
import { ProductThumbnailUploadField } from '../CreateProduct/FileUploadInputs';

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
  price: rules.requiredPositiveNumber,
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
    price: '',
    image: '',
    inStock: false,
    isFeatured: false,
    properties: {},
  },
  resolver: yupResolver(schema),
};

function PropertyInputType({ prop }) {
  if (prop.type === 'text') {
    return (
      <FormAutoComplete
        key={prop.name}
        name={`properties.${prop.name}`}
        label={prop.label}
        options={prop.choices.map(c => c.name)}
        getOptionLabel={option => option || ''}
        getOptionSelected={(option, value) => option?.name === value}
        fullWidth
      />
    );
  }
  if (prop.type === 'bool') {
    return <FormCheckbox key={prop.name} name={`properties.${prop.name}`} label={prop.label} fullWidth />;
  }
  return null;
}

function ProductProperties({ chosenCategory, product }) {
  const cat = chosenCategory || product?.category;
  const properties = cat?.properties ? cat?.properties?.sort((a, b) => a.importance - b.importance) : [];

  return (
    properties.length > 0 && (
      <div style={{ marginTop: '1rem' }}>
        <Typography variant='subtitle1'>Properties</Typography>
        {properties.map((prop, idx) => (
          <PropertyInputType prop={prop} key={idx} />
        ))}
      </div>
    )
  );
}

function EditProductForm({ productId }) {
  const classes = useStyles();
  const toast = useContext(ToastContext);
  const [baseFormObj, setBaseFormObj] = React.useState({});

  const methods = useForm(formOpts);
  const { handleSubmit, setError, reset, watch } = methods;

  const { data: product } = useProduct(productId);
  const { data: brandsList } = useBrands();
  const { data: categoriesList } = useCategories();

  const editProductMutation = useUpdateProduct(productId);

  const onSubmit = values => {
    const changes = diff(baseFormObj, values);
    const { properties } = values;
    const { image, properties: changedProperties, price, ...rest } = changes;
    const formData = new FormData();

    const fields = transformKeysToSnakeCase(rest);

    if (price) {
      formData.append('price', priceToLowestCurrencyDenomination(price));
    }
    if (image) {
      formData.append('image', image);
    }
    Object.keys(fields).forEach(name => {
      formData.append(name, fields[name]);
    });
    if (changedProperties && !isEmptyObject(changedProperties)) {
      formData.append('properties', JSON.stringify(transformKeysToSnakeCase(properties)));
    }

    if (_.isEmpty(changes) || (!_.isEmpty(changes) && _.isEqual(changes, { properties: {} }))) {
      toast.info('No changes applied');
    }

    if (!_.isEmpty(changes) && !_.isEqual(changes, { properties: {} })) {
      editProductMutation.mutate({ id: product.id, formData });
    }
  };

  const onError = () => {
    toast.error('Form has errors, please check the details');
  };

  React.useEffect(() => {
    if (product) {
      // eslint-disable-next-line no-unused-vars
      const { image, price, brand, category, properties, ...rest } = product;

      const obj = {
        ...rest,
        image: '',
        price: formatPriceForDisplay(price),
        brandId: brand,
        categoryId: category,
        properties: transformKeysToSnakeCase(properties),
      };

      setBaseFormObj(obj);
      reset(obj);
    }
  }, [product, reset]);

  useFormServerErrors(editProductMutation?.error, setError);

  const chosenCategory = watch('categoryId');

  return (
    <Container component='main' maxWidth='xs'>
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
            <ProductThumbnailUploadField name='image' />
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

export default EditProductForm;
