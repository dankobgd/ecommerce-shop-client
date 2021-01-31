import React, { useContext } from 'react';

import { yupResolver } from '@hookform/resolvers';
import { Avatar, Box, CircularProgress, Container, Tab, Tabs, Typography } from '@material-ui/core';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import { makeStyles } from '@material-ui/styles';
import _ from 'lodash';
import { FormProvider, useForm } from 'react-hook-form';
import * as Yup from 'yup';

import {
  FormTextField,
  FormSubmitButton,
  FormSwitch,
  FormAutoComplete,
  FormCheckbox,
  FormNumberField,
  FormDateTimePicker,
} from '../../../components/Form';
import ErrorMessage from '../../../components/Message/ErrorMessage';
import { ToastContext } from '../../../components/Toast/ToastContext';
import { useBrands } from '../../../hooks/queries/brandQueries';
import { useCategories } from '../../../hooks/queries/categoryQueries';
import { useInsertPricing, useProduct, useUpdateProduct } from '../../../hooks/queries/productQueries';
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
    image: '',
    inStock: false,
    isFeatured: false,
    properties: {},
  },
  resolver: yupResolver(schema),
};

const pricingSchema = Yup.object({
  price: rules.requiredPositiveNumber,
  saleStarts: rules.startDate,
  saleEnds: rules.endDate('saleStarts'),
});

const pricingFormOpts = {
  mode: 'onChange',
  reValidateMode: 'onChange',
  defaultValues: {
    productId: '',
    price: '',
    saleStarts: null,
    saleEnds: null,
  },
  resolver: yupResolver(pricingSchema),
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

  const a11yProps = index => ({
    id: `edit-product-tab-${index}`,
    'aria-controls': `edit-product-tabpanel-${index}`,
  });

  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [baseFormObj, setBaseFormObj] = React.useState({});
  const methods = useForm(formOpts);
  const { handleSubmit, setError, reset, watch } = methods;
  const chosenCategory = watch('categoryId');

  const { data: product } = useProduct(productId);
  const { data: brandsList } = useBrands();
  const { data: categoriesList } = useCategories();

  const editProductMutation = useUpdateProduct(productId);

  const onSubmit = values => {
    const changes = diff(baseFormObj, values);
    const { properties } = values;
    // eslint-disable-next-line no-unused-vars
    const { image, properties: changedProperties, price, ...rest } = changes;
    const formData = new FormData();

    const fields = transformKeysToSnakeCase(rest);

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
      editProductMutation.mutate(formData);
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
        brandId: brand,
        categoryId: category,
        properties: transformKeysToSnakeCase(properties),
      };

      setBaseFormObj(obj);
      reset(obj);
    }
  }, [product, reset]);

  // **************************** Pricing Form ****************************

  const [pricingBaseFormObj, setPricingBaseFormObj] = React.useState({});
  const pricingMethods = useForm(pricingFormOpts);
  const { handleSubmit: handleSubmitPricing, setError: setErrorPricing, reset: resetPricing } = pricingMethods;

  const insertPricingMutation = useInsertPricing(productId);

  const onSubmitPricing = values => {
    const base = {
      ...pricingBaseFormObj,
      saleStarts: new Date(pricingBaseFormObj.saleStarts).toISOString(),
      saleEnds: new Date(pricingBaseFormObj.saleEnds).toISOString(),
    };
    const vals = {
      ...values,
      saleStarts: new Date(values.saleStarts).toISOString(),
      saleEnds: new Date(values.saleEnds).toISOString(),
    };

    const changes = diff(base, vals);

    // eslint-disable-next-line no-unused-vars
    const { price, saleStarts, saleEnds, ...rest } = changes;

    if (_.isEmpty(changes)) {
      toast.info('No changes applied');
    }

    if (!_.isEmpty(changes)) {
      const payload = { ...values, productId: Number(productId) };
      payload.saleStarts = saleStarts || base.saleStarts;
      payload.saleEnds = saleEnds || base.saleEnds;
      payload.price = price ? priceToLowestCurrencyDenomination(price) : priceToLowestCurrencyDenomination(base.price);

      insertPricingMutation.mutate(payload);
    }
  };

  const onErrorPricing = () => {
    toast.error('Form has errors, please check the details');
  };

  React.useEffect(() => {
    if (product) {
      // eslint-disable-next-line no-unused-vars
      const { price, saleStarts, saleEnds, id, ...rest } = product;

      const obj = {
        id,
        saleStarts,
        saleEnds,
        price: formatPriceForDisplay(price),
      };

      setPricingBaseFormObj(obj);
      resetPricing(obj);
    }
  }, [product, resetPricing]);

  useFormServerErrors(editProductMutation?.error, setError);
  useFormServerErrors(insertPricingMutation?.error, setErrorPricing);

  return (
    <Container component='main' maxWidth='xs'>
      <div className={classes.tabs}>
        <Tabs value={value} onChange={handleChange} aria-label='product view and relations tabs' variant='fullWidth'>
          <Tab label='Edit Product' {...a11yProps(0)} />
          <Tab label='Edit Pricing' {...a11yProps(1)} />
        </Tabs>
      </div>
      <div>
        <TabPanel value={value} index={0}>
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
                <FormTextField name='id' fullWidth inputProps={{ readOnly: true }} disabled />
                <BrandDropdown fullWidth options={brandsList?.data ?? []} defaultValue={product?.brand || ''} />
                <CategoryDropdown
                  fullWidth
                  options={categoriesList?.data ?? []}
                  defaultValue={product?.category || ''}
                />
                <FormTextField name='name' fullWidth />
                <FormTextField name='slug' fullWidth />
                <FormTextField name='description' multiline fullWidth rows={5} />
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
        </TabPanel>
        <TabPanel value={value} index={1}>
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <AttachMoneyIcon />
            </Avatar>
            <Typography component='h1' variant='h5'>
              Edit Pricing
            </Typography>

            {insertPricingMutation?.isLoading && <CircularProgress />}
            {insertPricingMutation?.isError && <ErrorMessage message={insertPricingMutation?.error?.message} />}

            <FormProvider {...pricingMethods}>
              <form onSubmit={handleSubmitPricing(onSubmitPricing, onErrorPricing)} noValidate>
                <FormTextField name='id' fullWidth inputProps={{ readOnly: true }} disabled />
                <FormNumberField name='price' prefix='$' fullWidth />
                <FormDateTimePicker name='saleStarts' fullWidth minutesStep={1} />
                <FormDateTimePicker name='saleEnds' fullWidth minutesStep={1} disablePast />

                <FormSubmitButton className={classes.submit} fullWidth loading={insertPricingMutation?.isLoading}>
                  Save Changes
                </FormSubmitButton>
              </form>
            </FormProvider>
          </div>
        </TabPanel>
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

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

// import React, { useContext } from 'react';

// import { yupResolver } from '@hookform/resolvers';
// import { Avatar, CircularProgress, Container, Typography } from '@material-ui/core';
// import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
// import { makeStyles } from '@material-ui/styles';
// import _ from 'lodash';
// import { FormProvider, useForm } from 'react-hook-form';
// import * as Yup from 'yup';

// import { FormTextField, FormSubmitButton, FormSwitch, FormAutoComplete, FormCheckbox } from '../../../components/Form';
// import ErrorMessage from '../../../components/Message/ErrorMessage';
// import { ToastContext } from '../../../components/Toast/ToastContext';
// import { useBrands } from '../../../hooks/queries/brandQueries';
// import { useCategories } from '../../../hooks/queries/categoryQueries';
// import { useProduct, useUpdateProduct } from '../../../hooks/queries/productQueries';
// import { useFormServerErrors } from '../../../hooks/useFormServerErrors';
// import { isEmptyObject, diff } from '../../../utils/diff';
// import { transformKeysToSnakeCase } from '../../../utils/transformObjectKeys';
// import { rules } from '../../../utils/validation';
// import { ProductThumbnailUploadField } from '../CreateProduct/FileUploadInputs';

// const useStyles = makeStyles(theme => ({
//   paper: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//   },
//   avatar: {
//     margin: theme.spacing(1),
//     backgroundColor: theme.palette.secondary.main,
//   },
//   form: {
//     width: '100%',
//     marginTop: theme.spacing(1),
//   },
//   submit: {
//     margin: theme.spacing(3, 0, 2),
//   },
// }));

// const schema = Yup.object({
//   brandId: Yup.object()
//     .test('required', 'brand is a required field', value => !!value)
//     .nullable(),
//   categoryId: Yup.object()
//     .test('required', 'category is a required field', value => !!value)
//     .nullable(),
//   name: Yup.string().required(),
//   slug: Yup.string().required(),
//   description: Yup.string(),
//   inStock: Yup.boolean().required(),
//   isFeatured: Yup.boolean().required(),
//   image: rules.optionalImage,
//   // properties: rules.productProperties,
// });

// const formOpts = {
//   mode: 'onChange',
//   reValidateMode: 'onChange',
//   defaultValues: {
//     brandId: null,
//     categoryId: null,
//     name: '',
//     slug: '',
//     description: '',
//     image: '',
//     inStock: false,
//     isFeatured: false,
//     properties: {},
//   },
//   resolver: yupResolver(schema),
// };

// function PropertyInputType({ prop }) {
//   if (prop.type === 'text') {
//     return (
//       <FormAutoComplete
//         key={prop.name}
//         name={`properties.${prop.name}`}
//         label={prop.label}
//         options={prop.choices.map(c => c.name)}
//         getOptionLabel={option => option || ''}
//         getOptionSelected={(option, value) => option?.name === value}
//         fullWidth
//       />
//     );
//   }
//   if (prop.type === 'bool') {
//     return <FormCheckbox key={prop.name} name={`properties.${prop.name}`} label={prop.label} fullWidth />;
//   }
//   return null;
// }

// function ProductProperties({ chosenCategory, product }) {
//   const cat = chosenCategory || product?.category;
//   const properties = cat?.properties ? cat?.properties?.sort((a, b) => a.importance - b.importance) : [];

//   return (
//     properties.length > 0 && (
//       <div style={{ marginTop: '1rem' }}>
//         <Typography variant='subtitle1'>Properties</Typography>
//         {properties.map((prop, idx) => (
//           <PropertyInputType prop={prop} key={idx} />
//         ))}
//       </div>
//     )
//   );
// }

// function EditProductForm({ productId }) {
//   const classes = useStyles();
//   const toast = useContext(ToastContext);
//   const [baseFormObj, setBaseFormObj] = React.useState({});

//   const methods = useForm(formOpts);
//   const { handleSubmit, setError, reset, watch } = methods;

//   const { data: product } = useProduct(productId);
//   const { data: brandsList } = useBrands();
//   const { data: categoriesList } = useCategories();

//   const editProductMutation = useUpdateProduct(productId);

//   const onSubmit = values => {
//     const changes = diff(baseFormObj, values);
//     const { properties } = values;
//     // eslint-disable-next-line no-unused-vars
//     const { image, properties: changedProperties, price, ...rest } = changes;
//     const formData = new FormData();

//     const fields = transformKeysToSnakeCase(rest);

//     if (image) {
//       formData.append('image', image);
//     }
//     Object.keys(fields).forEach(name => {
//       formData.append(name, fields[name]);
//     });
//     if (changedProperties && !isEmptyObject(changedProperties)) {
//       formData.append('properties', JSON.stringify(transformKeysToSnakeCase(properties)));
//     }

//     if (_.isEmpty(changes) || (!_.isEmpty(changes) && _.isEqual(changes, { properties: {} }))) {
//       toast.info('No changes applied');
//     }

//     if (!_.isEmpty(changes) && !_.isEqual(changes, { properties: {} })) {
//       editProductMutation.mutate(formData);
//     }
//   };

//   const onError = () => {
//     toast.error('Form has errors, please check the details');
//   };

//   React.useEffect(() => {
//     if (product) {
//       // eslint-disable-next-line no-unused-vars
//       const { image, price, brand, category, properties, ...rest } = product;

//       const obj = {
//         ...rest,
//         image: '',
//         brandId: brand,
//         categoryId: category,
//         properties: transformKeysToSnakeCase(properties),
//       };

//       setBaseFormObj(obj);
//       reset(obj);
//     }
//   }, [product, reset]);

//   useFormServerErrors(editProductMutation?.error, setError);

//   const chosenCategory = watch('categoryId');

//   return (
//     <Container component='main' maxWidth='xs'>
//       <div className={classes.paper}>
//         <Avatar className={classes.avatar}>
//           <ShoppingBasketIcon />
//         </Avatar>
//         <Typography component='h1' variant='h5'>
//           Edit Product
//         </Typography>

//         {editProductMutation?.isLoading && <CircularProgress />}
//         {editProductMutation?.isError && <ErrorMessage message={editProductMutation?.error?.message} />}

//         <FormProvider {...methods}>
//           <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
//             <BrandDropdown fullWidth options={brandsList?.data ?? []} defaultValue={product?.brand || ''} />
//             <CategoryDropdown fullWidth options={categoriesList?.data ?? []} defaultValue={product?.category || ''} />
//             <FormTextField name='name' fullWidth />
//             <FormTextField name='slug' fullWidth />
//             <FormTextField name='description' multiline fullWidth rows={5} />
//             <FormSwitch name='inStock' />
//             <FormSwitch name='isFeatured' />
//             <ProductThumbnailUploadField name='image' />
//             <ProductProperties chosenCategory={chosenCategory} product={product} />

//             <FormSubmitButton className={classes.submit} fullWidth loading={editProductMutation?.isLoading}>
//               Save Changes
//             </FormSubmitButton>
//           </form>
//         </FormProvider>
//       </div>
//     </Container>
//   );
// }

// const getOptionLabel = option => option.name || '';
// const getOptionSelected = (option, value) => option.id === value.id;

// const BrandDropdown = ({ options, ...rest }) => (
//   <FormAutoComplete
//     {...rest}
//     name='brandId'
//     label='Brand'
//     options={options}
//     getOptionLabel={getOptionLabel}
//     getOptionSelected={getOptionSelected}
//   />
// );

// const CategoryDropdown = ({ options, ...rest }) => (
//   <FormAutoComplete
//     {...rest}
//     name='categoryId'
//     label='Category'
//     options={options}
//     getOptionLabel={getOptionLabel}
//     getOptionSelected={getOptionSelected}
//   />
// );

// export default EditProductForm;
