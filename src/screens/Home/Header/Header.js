import React from 'react';

import { makeStyles } from '@material-ui/core';
import { useForm, FormProvider } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { selectUIState } from '../../../store/ui';
import SearchBar from '../SearchBar/SearchBar';

const topFilms = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
];

const formOpts = {
  mode: 'onChange',
  reValidateMode: 'onChange',
  defaultValues: {
    search: null,
  },
};

const useStyles = makeStyles(theme => ({
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
  const dispatch = useDispatch();
  const methods = useForm(formOpts);
  const { handleSubmit, setError } = methods;
  // const { loading, error } = useSelector(selectUIState(null));

  const onSubmit = data => {
    console.log(data);
  };

  return (
    <div className={classes.headerOuter}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className={classes.form} noValidate>
          <SearchBar options={topFilms} />
        </form>
      </FormProvider>
    </div>
  );
}

export default Header;
