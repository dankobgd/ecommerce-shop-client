import { useContext } from 'react';

import { navigate } from '@reach/router';
import { nanoid } from 'nanoid';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import api from '../../api';
import { CartContext, resetAll } from '../../components/ShoppingCart/CartContext';
import { ToastContext } from '../../components/Toast/ToastContext';
import { getPersistedPagination, matches } from '../../utils/pagination';

export function useMe() {
  const queryClient = useQueryClient();

  return useQuery('user', () => api.users.getCurrent(), {
    retry: false,
    staleTime: 1000 * 60 * 60,
    initialData: () => queryClient.getQueryData('user'),
    refetchOnWindowFocus: false,
  });
}

export function useUserFromCache() {
  const queryClient = useQueryClient();
  return queryClient.getQueryData('user');
}

export function useUsersCount() {
  return useQuery(['users', 'count'], () => api.users.count());
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  const toast = useContext(ToastContext);
  const meta = getPersistedPagination('users');
  const keys = queryClient.getQueryCache().findAll('users');

  return useMutation(formData => api.users.create(formData), {
    onMutate: formData => {
      queryClient.cancelQueries('users');
      const previousValue = queryClient.getQueryData('users', { active: true });

      keys.forEach(key => {
        if (matches(key)) {
          queryClient.setQueryData(key, old => ({
            ...old,
            data: [...old.data, { id: nanoid(), ...formData }],
          }));
        }
      });

      return previousValue;
    },
    onSuccess: () => {
      toast.success('User created');
    },
    onError: (_, __, previousValue) => {
      queryClient.setQueryData(['users', meta], previousValue);
      toast.error('Form has errors, please check the details');
    },
    onSettled: () => {
      queryClient.invalidateQueries('users');
    },
  });
}

export function useUpdateUser(authUserId, userId) {
  const queryClient = useQueryClient();
  const toast = useContext(ToastContext);

  const keys = queryClient.getQueryCache().findAll('users');

  return useMutation(formData => api.users.update(userId, formData), {
    onMutate: formData => {
      queryClient.cancelQueries('users');
      const previousValue = queryClient.getQueryData(['users', userId]);

      keys.forEach(key => {
        if (matches(key)) {
          queryClient.setQueryData(key, old => ({
            ...old,
            data: [...old.data.map(x => (x.id === Number(userId) ? { ...x, ...formData } : x))],
          }));
        }
      });

      queryClient.setQueryData(['users', userId], formData);
      return previousValue;
    },
    onSuccess: () => {
      toast.success('User updated');
    },
    onError: (_, __, previousValue) => {
      queryClient.setQueryData(['users', userId], previousValue);
      toast.error('Form has errors, please check the details');
    },
    onSettled: () => {
      queryClient.invalidateQueries('users');
      if (Number(authUserId) === Number(userId)) {
        queryClient.invalidateQueries('user');
      }
    },
  });
}

export function useUpdateUserProfile(userId) {
  const queryClient = useQueryClient();
  const toast = useContext(ToastContext);

  const keys = queryClient.getQueryCache().findAll('users');

  return useMutation(({ id, values }) => api.users.updateProfile(id, values), {
    onMutate: data => {
      queryClient.cancelQueries('users');
      const previousValue = queryClient.getQueryData(['users', userId]);

      keys.forEach(key => {
        if (matches(key)) {
          queryClient.setQueryData(key, old => ({
            ...old,
            data: [...old.data.map(x => (x.id === Number(userId) ? { ...x, ...data.values } : x))],
          }));
        }
      });

      queryClient.setQueryData(['users', userId], data.values);
      return previousValue;
    },
    onSuccess: () => {
      toast.success('User updated');
    },
    onError: (_, __, previousValue) => {
      queryClient.setQueryData(['users', userId], previousValue);
      toast.error('Form has errors, please check the details');
    },
    onSettled: () => {
      queryClient.invalidateQueries('users');
    },
  });
}

export function useUser(userId) {
  const queryClient = useQueryClient();

  return useQuery(['users', userId], () => api.users.get(userId), {
    initialData: () => queryClient.getQueryData('users')?.data?.find(x => x.id === Number(userId)),
  });
}

export function useUsers(query, config) {
  const queryClient = useQueryClient();
  const params = new URLSearchParams(query || '');
  const key = query ? ['users', query] : ['users'];

  return useQuery(key, () => api.users.getAll(params), {
    initialData: () => queryClient.getQueryData(key),
    ...config,
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  const toast = useContext(ToastContext);
  const meta = getPersistedPagination('users');
  const keys = queryClient.getQueryCache().findAll('users');

  return useMutation(id => api.users.delete(id), {
    onMutate: id => {
      const previousValue = queryClient.getQueryData('users', { active: true });

      keys.forEach(key => {
        if (matches(key)) {
          queryClient.cancelQueries(key);
          const filtered = previousValue?.data?.filter(x => x.id !== id);
          const obj = { ...previousValue, data: filtered };
          queryClient.setQueryData(key, obj);
        }
      });

      return previousValue;
    },
    onSuccess: () => {
      toast.success('User deleted');
    },
    onError: (_, __, previousValue) => {
      queryClient.setQueryData(['users', meta], previousValue);
      toast.error('Error deleting the user');
    },
    onSettled: () => {
      queryClient.invalidateQueries('users');
    },
  });
}

export function useDeleteUsers(config) {
  const queryClient = useQueryClient();
  const toast = useContext(ToastContext);
  const meta = getPersistedPagination('users');
  const keys = queryClient.getQueryCache().findAll('users');

  return useMutation(ids => api.users.bulkDelete(ids), {
    onMutate: ids => {
      const previousValue = queryClient.getQueryData('users', { active: true });

      keys.forEach(key => {
        if (matches(key)) {
          queryClient.cancelQueries(key);
          const filtered = previousValue?.data?.filter(x => !ids.includes(x.id));
          const obj = { ...previousValue, data: filtered };
          queryClient.setQueryData(key, obj);
        }
      });

      return previousValue;
    },
    onSuccess: () => {
      toast.success('Users deleted');
      if (config?.onSuccess) {
        config.onSuccess();
      }
    },
    onError: (_, __, previousValue) => {
      queryClient.setQueryData(['users', meta], previousValue);
      toast.error('Error deleting users');
    },
    onSettled: () => {
      queryClient.invalidateQueries('users');
    },
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const toast = useContext(ToastContext);

  return useMutation(values => api.users.login(values), {
    onSuccess: result => {
      localStorage.setItem('ecommerce/authenticated', true);
      navigate('/');
      toast.success(`Welcome ${result?.username}`);
    },
    onError: () => {
      toast.error('Form has errors, please check the details');
    },
    onSettled: () => {
      queryClient.invalidateQueries('user');
    },
    retry: false,
  });
}

export function useSignup() {
  const queryClient = useQueryClient();
  const toast = useContext(ToastContext);

  return useMutation(values => api.users.signup(values), {
    onSuccess: result => {
      localStorage.setItem('ecommerce/authenticated', true);
      navigate('/');
      toast.success(`Welcome ${result?.username}`);
    },
    onError: () => {
      toast.error('Form has errors, please check the details');
    },
    onSettled: () => {
      queryClient.invalidateQueries('user');
    },
    retry: false,
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const toast = useContext(ToastContext);
  const { dispatch } = useContext(CartContext);

  return useMutation(() => api.users.logout(), {
    onSuccess: () => {
      queryClient.setQueryData('user', null);
      localStorage.removeItem('ecommerce/authenticated');
      navigate('/');
      toast.success(`You logged out`);
      dispatch(resetAll());
    },
    onSettled: () => {
      queryClient.invalidateQueries('user');
    },
  });
}

export function useForgotPassword() {
  const toast = useContext(ToastContext);

  return useMutation(values => api.users.forgotPassword(values), {
    onSuccess: () => {
      toast.success('Password reset Email has been sent');
    },
    onError: () => {
      toast.error('Form has errors, please check the details');
    },
  });
}

export function useResetPassword() {
  const toast = useContext(ToastContext);

  return useMutation(values => api.users.resetPassword(values), {
    onSuccess: () => {
      toast.success('Password reset Email has been sent');
    },
    onError: () => {
      toast.error('Form has errors, please check the details');
    },
  });
}

export function useUserAddress(addressId, config) {
  const queryClient = useQueryClient();

  return useQuery(['user', 'addresses', addressId], () => api.users.getAddress(addressId), {
    initialData: () => queryClient.getQueryData(['user', 'addresses', addressId?.toString()]),
    ...config,
  });
}

export function useUserAddresses() {
  const queryClient = useQueryClient();

  return useQuery(['user', 'addresses'], () => api.users.getAddresses(), {
    initialData: () => queryClient.getQueryData(['user', 'addresses']),
  });
}

export function useCreateAddress(config) {
  const queryClient = useQueryClient();
  const toast = useContext(ToastContext);

  return useMutation(values => api.users.createAddress(values), {
    onMutate: values => {
      queryClient.cancelQueries(['user', 'addresses']);
      const previousValue = queryClient.getQueryData(['user', 'addresses']);
      queryClient.setQueryData(['user', 'addresses'], old => ({
        ...old,
        values,
      }));
      return previousValue;
    },
    onSuccess: () => {
      toast.success('Address created');
      if (config?.onSuccess) {
        config.onSuccess();
      }
    },
    onError: (_, __, previousValue) => {
      queryClient.setQueryData(['user', 'addresses'], previousValue);
      toast.error('Form has errors, please check the details');
    },
    onSettled: () => {
      queryClient.invalidateQueries(['user', 'addresses']);
    },
  });
}

export function useUpdateAddress(config) {
  const queryClient = useQueryClient();
  const toast = useContext(ToastContext);

  return useMutation(({ id, values }) => api.users.updateAddress(id, values), {
    onMutate: ({ id, values }) => {
      queryClient.cancelQueries(['user', 'addresses']);
      const previousValue = queryClient.getQueryData(['user', 'addresses']);
      queryClient.setQueryData(['user', 'addresses'], old =>
        old.map(x => (x.id === Number(id) ? { ...x, ...values } : x))
      );
      return previousValue;
    },
    onSuccess: () => {
      toast.success('Address updated');
      if (config?.onSuccess) {
        config.onSuccess();
      }
    },
    onError: (_, __, previousValue) => {
      queryClient.setQueryData(['user', 'addresses'], previousValue);
      toast.error('Form has errors, please check the details');
    },
    onSettled: () => {
      queryClient.invalidateQueries(['user', 'addresses']);
    },
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  const toast = useContext(ToastContext);

  return useMutation(id => api.users.deleteAddress(id), {
    onMutate: id => {
      queryClient.cancelQueries(['user', 'addresses']);
      const previousValue = queryClient.getQueryData(['user', 'addresses']);
      const filtered = previousValue?.filter(x => x.id !== id);
      queryClient.setQueryData(['user', 'addresses'], filtered);
      return previousValue;
    },
    onSuccess: () => {
      toast.success('Address deleted');
    },
    onError: (_, __, previousValue) => {
      queryClient.setQueryData(['user', 'addresses'], previousValue);
      toast.error('Error deleting the address');
    },
    onSettled: () => {
      queryClient.invalidateQueries(['user', 'addresses']);
    },
  });
}

export function useUploadAvatar({ setShowUploadButton }) {
  const queryClient = useQueryClient();
  const toast = useContext(ToastContext);

  return useMutation(formData => api.users.uploadAvatar(formData), {
    onMutate: formData => {
      queryClient.cancelQueries('user');
      const previousValue = queryClient.getQueryData('user');
      queryClient.setQueryData('user', old => ({
        ...old,
        formData,
      }));
      return previousValue;
    },
    onSuccess: () => {
      toast.success('Avatar uploaded');
    },
    onError: (_, __, previousValue) => {
      queryClient.setQueryData('user', previousValue);
      toast.error('Form has errors, please check the details');
    },
    onSettled: () => {
      setShowUploadButton(false);
      queryClient.invalidateQueries('user');
    },
  });
}

export function useDeleteAvatar() {
  const queryClient = useQueryClient();
  const toast = useContext(ToastContext);

  return useMutation(id => api.users.deleteAvatar(id), {
    onMutate: () => {
      queryClient.cancelQueries('user');
      const previousValue = queryClient.getQueryData('user');
      const obj = { ...previousValue, avatarUrl: '', avatarPublicId: '' };
      queryClient.setQueryData('user', obj);
      return previousValue;
    },
    onSuccess: () => {
      toast.success('Avatar deleted');
    },
    onError: (_, __, previousValue) => {
      queryClient.setQueryData('user', previousValue);
      toast.error('Error deleting the avatar');
    },
    onSettled: () => {
      queryClient.invalidateQueries('user');
    },
  });
}

export function useEditProfile() {
  const queryClient = useQueryClient();
  const toast = useContext(ToastContext);

  return useMutation(values => api.users.updateProfile(values), {
    onMutate: values => {
      queryClient.cancelQueries('user');
      const previousValue = queryClient.getQueryData('user');
      queryClient.setQueryData('user', old => ({
        ...old,
        values,
      }));
      return previousValue;
    },
    onSuccess: () => {
      toast.success('Details updated');
    },
    onError: (_, __, previousValue) => {
      queryClient.setQueryData('user', previousValue);
      toast.error('Form has errors, please check the details');
    },
    onSettled: () => {
      queryClient.invalidateQueries('user');
    },
  });
}

export function useChangePassword() {
  const queryClient = useQueryClient();
  const toast = useContext(ToastContext);

  return useMutation(values => api.users.changePassword(values), {
    onMutate: formData => {
      queryClient.cancelQueries('user');
      const previousValue = queryClient.getQueryData('user');
      queryClient.setQueryData('user', old => ({
        ...old,
        formData,
      }));
      return previousValue;
    },
    onSuccess: () => {
      toast.success('Password updated');
    },
    onError: (_, __, previousValue) => {
      queryClient.setQueryData('user', previousValue);
      toast.error('Form has errors, please check the details');
    },
    onSettled: () => {
      queryClient.invalidateQueries('user');
    },
  });
}

export function useAddProductToWishlist() {
  const queryClient = useQueryClient();
  const toast = useContext(ToastContext);

  return useMutation(values => api.users.wishlistAdd(values), {
    onSuccess: () => {
      toast.success('product added to wishlist');
    },
    onError: () => {
      toast.error('Error while adding product to wishlist');
    },
    onSettled: () => {
      queryClient.invalidateQueries(['user', 'wishlist']);
    },
  });
}

export function useWishlist(config) {
  const queryClient = useQueryClient();

  return useQuery(['user', 'wishlist'], () => api.users.wishlistGet(), {
    initialData: () => queryClient.getQueryData(['user', 'wishlist']),
    ...config,
  });
}

export function useDeleteProductFromWishlist() {
  const queryClient = useQueryClient();
  const toast = useContext(ToastContext);

  return useMutation(productId => api.users.wishlistDelete(productId), {
    onMutate: productId => {
      queryClient.cancelQueries(['user', 'wishlist']);
      const previousValue = queryClient.getQueryData(['user', 'wishlist']);
      const filtered = previousValue?.filter(x => x.id !== productId);
      queryClient.setQueryData(['user', 'wishlist'], filtered);
      return previousValue;
    },
    onSuccess: () => {
      toast.success('Product removed from wishlist');
    },
    onError: (_, __, previousValue) => {
      queryClient.setQueryData(['user', 'wishlist'], previousValue);
      toast.error('Error while deleting product from wishlist');
    },
    onSettled: () => {
      queryClient.invalidateQueries(['user', 'wishlist']);
    },
  });
}

export function useClearWishlist() {
  const queryClient = useQueryClient();
  const toast = useContext(ToastContext);

  return useMutation(() => api.users.wishlistClear(), {
    onMutate: () => {
      queryClient.cancelQueries(['user', 'wishlist']);
      const previousValue = queryClient.getQueryData(['user', 'wishlist']);
      queryClient.setQueryData(['user', 'wishlist'], []);
      return previousValue;
    },
    onSuccess: () => {
      toast.success('Wishlist cleared');
    },
    onError: (_, __, previousValue) => {
      queryClient.setQueryData(['user', 'wishlist'], previousValue);
      toast.error('Error clearing the wishlist');
    },
    onSettled: () => {
      queryClient.invalidateQueries(['user', 'wishlist']);
    },
  });
}

// orders
export function useUserOrders(userId, query, config) {
  const queryClient = useQueryClient();
  const params = new URLSearchParams(query || '');
  const key = query ? ['user', userId, 'orders', query] : ['user', userId, 'orders'];

  return useQuery(key, () => api.users.getOrders(userId, params), {
    initialData: () => queryClient.getQueryData(key),
    ...config,
  });
}
