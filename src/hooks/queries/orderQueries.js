import { useContext } from 'react';

import { navigate } from '@reach/router';
import { nanoid } from 'nanoid';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import api from '../../api';
import { ToastContext } from '../../components/Toast/ToastContext';
import { getPersistedPagination, matches } from '../../utils/pagination';

export function useOrder(orderId) {
  const queryClient = useQueryClient();

  return useQuery(['orders', orderId], () => api.orders.get(orderId), {
    initialData: () => queryClient.getQueryData('orders')?.data?.find(x => x.id === Number(orderId)),
  });
}

export function useOrders(query, config) {
  const queryClient = useQueryClient();
  const params = new URLSearchParams(query || '');
  const key = query ? ['orders', query] : ['orders'];

  return useQuery(key, () => api.orders.getAll(params), {
    initialData: () => queryClient.getQueryData(key),
    ...config,
  });
}

export function useOrderDetails(orderId) {
  const queryClient = useQueryClient();

  return useQuery(['orders', orderId, 'details'], () => api.orders.getDetails(orderId), {
    initialData: () => queryClient.getQueryData(['orders', orderId, 'details']),
  });
}

export function useCreateOrder(config) {
  const queryClient = useQueryClient();
  const toast = useContext(ToastContext);
  const meta = getPersistedPagination('orders');
  const keys = queryClient.getQueryCache().findAll('orders');

  return useMutation(data => api.orders.create(data), {
    onMutate: values => {
      queryClient.cancelQueries('orders');
      const previousValue = queryClient.getQueryData('orders', { active: true });

      keys.forEach(key => {
        if (matches(key)) {
          queryClient.setQueryData(key, old => ({
            ...old,
            data: [...old.data, { id: nanoid(), ...values }],
          }));
        }
      });

      return previousValue;
    },
    onSuccess: () => {
      toast.success('Order created');
      navigate('/orders');
      if (config?.onSuccess) {
        config.onSuccess();
      }
    },
    onError: (_, __, previousValue) => {
      queryClient.setQueryData(['orders', meta], previousValue);
      toast.error('Form has errors, please check the details');
      if (config?.onError) {
        config.onError();
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries('orders');
    },
  });
}
