import React, { useEffect, useState } from 'react';

import { yupResolver } from '@hookform/resolvers';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  Divider,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

import { FormSubmitButton, FormTextField } from '../../../components/Form';
import ErrorMessage from '../../../components/Message/ErrorMessage';
import { useFormServerErrors } from '../../../hooks/useFormServerErrors';
import { selectUIState } from '../../../store/ui';
import {
  createAddress,
  getAddresses,
  selectCurrentEditAddress,
  selectUserAddresses,
  updateAddress,
} from '../../../store/user/userSlice';
import AddressTable from './AddressTable/AddressTable';
import AddressToolbar from './AddressToolbar/AddressToolbar';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3),
  },
  content: {
    marginTop: theme.spacing(2),
  },
}));

const schema = Yup.object({
  line1: Yup.string().required(),
  line2: Yup.string(),
  city: Yup.string().required(),
  country: Yup.string().required(),
  state: Yup.string(),
  phone: Yup.string(),
});

const formOpts1 = {
  mode: 'onChange',
  reValidateMode: 'onChange',
  resolver: yupResolver(schema),
  defaultValues: {
    line1: '',
    line2: '',
    city: '',
    country: '',
    state: '',
    phone: '',
  },
};

const formOpts2 = addr => ({
  mode: 'onChange',
  reValidateMode: 'onChange',
  resolver: yupResolver(schema),
  defaultValues: {
    line1: addr?.line1 || '',
    line2: addr?.line2 || '',
    city: addr?.city || '',
    country: addr?.country || '',
    state: addr?.state || '',
    phone: addr?.phone || '',
  },
});

function AccountAddress() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const addresses = useSelector(selectUserAddresses);
  const editAddress = useSelector(selectCurrentEditAddress);

  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = () => {
    setModalOpen(true);
  };
  const handleModalClose = () => {
    setModalOpen(false);
  };

  const methods1 = useForm(formOpts1);
  const { handleSubmit: handleSubmitCreateAddress, setError: setErrorCreateAddress } = methods1;
  const { loading: loadingCreateAddress, error: errorCreateAddress } = useSelector(selectUIState(createAddress));
  const onSubmitCreateAddress = async data => {
    await dispatch(createAddress(data));
  };

  const methods2 = useForm(formOpts2(editAddress));
  const { handleSubmit: handleSubmitEditAddress, setError: setErrorEditAddress, reset } = methods2;
  const { loading: loadingEditAddress, error: errorEditAddress } = useSelector(selectUIState(updateAddress));
  const onSubmitEditAddress = async data => {
    const payload = { id: editAddress.id, details: data };
    await dispatch(updateAddress(payload));
  };

  useEffect(() => {
    dispatch(getAddresses());
  }, [dispatch]);

  useEffect(() => {
    reset({
      line1: editAddress?.line1 || '',
      line2: editAddress?.line2 || '',
      city: editAddress?.city || '',
      country: editAddress?.country || '',
      state: editAddress?.state || '',
      phone: editAddress?.phone || '',
    });
  }, [reset, editAddress]);

  useFormServerErrors(errorCreateAddress, setErrorCreateAddress);
  useFormServerErrors(errorEditAddress, setErrorEditAddress);

  return (
    <>
      <Card>
        <CardHeader title='Addresses' />
        <Divider />

        <CardContent>
          <div className={classes.root}>
            <AddressToolbar handleModalOpen={handleModalOpen} />
            <div className={classes.content}>
              <AddressTable addresses={addresses} handleModalOpen={handleModalOpen} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby={`${editAddress ? 'edit' : 'create'}-address-dialog`}
      >
        <DialogTitle>{editAddress ? 'Edit' : 'Create'} User Address</DialogTitle>
        <DialogContent>
          {editAddress ? (
            <FormProvider {...methods2}>
              <form onSubmit={handleSubmitEditAddress(onSubmitEditAddress)} noValidate>
                {loadingEditAddress && <CircularProgress />}
                {errorEditAddress && <ErrorMessage message={errorEditAddress.message} />}

                <FormTextField name='line1' fullWidth />
                <FormTextField name='line2' fullWidth />
                <FormTextField name='city' fullWidth />
                <FormTextField name='country' fullWidth />
                <FormTextField name='state' fullWidth />
                <FormTextField name='phone' fullWidth />

                <Button onClick={handleModalClose} color='primary'>
                  Cancel
                </Button>
                <FormSubmitButton>Update Address</FormSubmitButton>
              </form>
            </FormProvider>
          ) : (
            <FormProvider {...methods1}>
              <form onSubmit={handleSubmitCreateAddress(onSubmitCreateAddress)} noValidate>
                {loadingCreateAddress && <CircularProgress />}
                {errorCreateAddress && <ErrorMessage message={errorCreateAddress.message} />}

                <FormTextField name='line1' fullWidth />
                <FormTextField name='line2' fullWidth />
                <FormTextField name='city' fullWidth />
                <FormTextField name='country' fullWidth />
                <FormTextField name='state' fullWidth />
                <FormTextField name='phone' fullWidth />

                <Button onClick={handleModalClose} color='primary'>
                  Cancel
                </Button>
                <FormSubmitButton>Add Address</FormSubmitButton>
              </form>
            </FormProvider>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AccountAddress;
