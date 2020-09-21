import React from 'react';

import { makeStyles } from '@material-ui/core';
import { useForm, FormProvider } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { productGetAll } from '../../../store/product/productSlice';
import { selectUIState } from '../../../store/ui';
import SearchBar from './Search';

const formOpts = {
  mode: 'onChange',
  reValidateMode: 'onChange',
  defaultValues: {
    search: null,
  },
};

const useStyles = makeStyles(() => ({
  headerOuter: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    width: '100%',
    padding: '2rem 5rem',
    maxWidth: '640px',
  },
}));

function Header() {
  const classes = useStyles();
  // const dispatch = useDispatch();
  const methods = useForm(formOpts);
  const { handleSubmit } = methods;
  const { loading, error } = useSelector(selectUIState(productGetAll));

  const onSubmit = data => {
    console.log(data);
  };

  return (
    <div className={classes.headerOuter}>
      <FormProvider {...methods}>
        {loading && <div>Loading...</div>}
        {error && <div>{error}</div>}
        <form onSubmit={handleSubmit(onSubmit)} className={classes.form} noValidate>
          <SearchBar options={[]} />
        </form>
      </FormProvider>
    </div>
  );
}

export default Header;
