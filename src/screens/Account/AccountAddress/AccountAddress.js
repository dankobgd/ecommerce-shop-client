import React, { useContext, useState } from 'react';

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
import * as Yup from 'yup';

import { FormSubmitButton, FormTextField } from '../../../components/Form';
import ErrorMessage from '../../../components/Message/ErrorMessage';
import { ToastContext } from '../../../components/Toast/ToastContext';
import {
  useUserAddresses,
  useUserAddress,
  useCreateAddress,
  useUserFromCache,
  useUpdateAddress,
} from '../../../hooks/queries/userQueries';
import { useFormServerErrors } from '../../../hooks/useFormServerErrors';
import { diff, isEmptyObject } from '../../../utils/diff';
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
  defaultValues: {
    line1: '',
    line2: '',
    city: '',
    country: '',
    state: '',
    phone: '',
  },
  resolver: yupResolver(schema),
};
const formOpts2 = {
  mode: 'onChange',
  reValidateMode: 'onChange',
  defaultValues: {
    line1: '',
    line2: '',
    city: '',
    country: '',
    state: '',
    phone: '',
  },
  resolver: yupResolver(schema),
};

function AccountAddress() {
  const classes = useStyles();
  const toast = useContext(ToastContext);
  const [baseFormObj, setBaseFormObj] = React.useState({});
  const user = useUserFromCache();

  const methods1 = useForm(formOpts1);
  const methods2 = useForm(formOpts2);

  const { handleSubmit: handleSubmitCreateAddress, setError: setErrorCreateAddress } = methods1;
  const { handleSubmit: handleSubmitEditAddress, setError: setErrorEditAddress, reset } = methods2;

  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = () => {
    setModalOpen(true);
  };
  const handleModalClose = () => {
    setModalOpen(false);
  };

  const { data: userAddresses } = useUserAddresses();
  const { data: address } = useUserAddress(1);

  const createAddressMutation = useCreateAddress();
  const editAddressMutation = useUpdateAddress();

  const onSubmitCreateAddress = values => {
    createAddressMutation.mutate(values);
  };

  const onSubmitEditAddress = values => {
    const changes = diff(baseFormObj, values);
    const payload = { id: address?.id, details: values };

    if (isEmptyObject(changes)) {
      toast.info('No changes applied');
    }

    if (!isEmptyObject(changes)) {
      editAddressMutation.mutate(payload);
    }
  };

  const onError = () => {
    toast.error('Form has errors, please check the details');
  };

  React.useEffect(() => {
    if (address) {
      setBaseFormObj(address);
      reset(address);
    }
  }, [address, reset]);

  useFormServerErrors(createAddressMutation?.error, setErrorCreateAddress);
  useFormServerErrors(editAddressMutation?.error, setErrorEditAddress);

  return (
    <>
      <Card>
        <CardHeader title='Addresses' />
        <Divider />

        <CardContent>
          <div className={classes.root}>
            <AddressToolbar handleModalOpen={handleModalOpen} />
            <div className={classes.content}>
              <AddressTable addresses={userAddresses} handleModalOpen={handleModalOpen} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby={`${address ? 'edit' : 'create'}-address-dialog`}
      >
        <DialogTitle>{address ? 'Edit' : 'Create'} User Address</DialogTitle>
        <DialogContent>
          {address ? (
            <FormProvider {...methods2}>
              <form onSubmit={handleSubmitEditAddress(onSubmitEditAddress, onError)} noValidate>
                {editAddressMutation?.isLoading && <CircularProgress />}
                {editAddressMutation?.isError && <ErrorMessage message={editAddressMutation?.error?.message} />}

                <FormTextField name='line1' fullWidth />
                <FormTextField name='line2' fullWidth />
                <FormTextField name='city' fullWidth />
                <FormTextField name='country' fullWidth />
                <FormTextField name='state' fullWidth />
                <FormTextField name='phone' fullWidth format='(###) ###-####' mask='_' />

                <Button onClick={handleModalClose} color='primary'>
                  Cancel
                </Button>
                <FormSubmitButton loading={editAddressMutation?.isLoading}>Update Address</FormSubmitButton>
              </form>
            </FormProvider>
          ) : (
            <FormProvider {...methods1}>
              <form onSubmit={handleSubmitCreateAddress(onSubmitCreateAddress, onError)} noValidate>
                {createAddressMutation?.isLoading && <CircularProgress />}
                {createAddressMutation?.isError && <ErrorMessage message={createAddressMutation?.error?.message} />}

                <FormTextField name='line1' fullWidth />
                <FormTextField name='line2' fullWidth />
                <FormTextField name='city' fullWidth />
                <FormTextField name='country' fullWidth />
                <FormTextField name='state' fullWidth />
                <FormTextField name='phone' fullWidth format='(###) ###-####' mask='_' />

                <Button onClick={handleModalClose} color='primary'>
                  Cancel
                </Button>
                <FormSubmitButton loading={createAddressMutation?.isLoading}>Add Address</FormSubmitButton>
              </form>
            </FormProvider>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AccountAddress;
