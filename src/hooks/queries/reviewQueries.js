import { useContext } from 'react';

import { nanoid } from 'nanoid';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import api from '../../api';
import { ToastContext } from '../../components/Toast/ToastContext';
import { getPersistedPagination, matches } from '../../utils/pagination';

export function useReview(reviewId) {
  const queryClient = useQueryClient();

  return useQuery(['reviews', reviewId], () => api.reviews.get(reviewId), {
    initialData: () => queryClient.getQueryData('reviews')?.data?.find(x => x.id === Number.parseInt(reviewId, 10)),
  });
}

export function useReviews(query, config) {
  const queryClient = useQueryClient();
  const params = new URLSearchParams(query || '');
  const key = query ? ['reviews', query] : ['reviews'];

  return useQuery(key, () => api.reviews.getAll(params), {
    initialData: () => queryClient.getQueryData(key),
    ...config,
  });
}

export function useCreateReview(config) {
  const queryClient = useQueryClient();
  const toast = useContext(ToastContext);
  const meta = getPersistedPagination('reviews');
  const keys = queryClient.getQueryCache().findAll('reviews');

  return useMutation(values => api.reviews.create(values), {
    onMutate: values => {
      queryClient.cancelQueries('reviews');
      const previousValue = queryClient.getQueryData('reviews', { active: true });

      queryClient.setQueryData(['product', String(values.productId), 'reviews'], old => [
        ...old,
        { id: nanoid(), ...values },
      ]);

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
      toast.success('Review created');
      if (config?.onSuccess) {
        config.onSuccess();
      }
    },
    onError: (_, __, previousValue) => {
      queryClient.setQueryData(['reviews', meta], previousValue);
      toast.error('Form has errors, please check the details');
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries('reviews');
      queryClient.invalidateQueries(['product', String(variables.productId), 'reviews']);
    },
  });
}

export function useUpdateReview(reviewId, config) {
  const queryClient = useQueryClient();
  const toast = useContext(ToastContext);

  const keys = queryClient.getQueryCache().findAll('reviews');

  return useMutation(({ id, values }) => api.reviews.update(id, values), {
    onMutate: data => {
      queryClient.cancelQueries('reviews');
      const previousValue = queryClient.getQueryData(['reviews', reviewId]);

      queryClient.setQueryData(['product', String(data.values.productId), 'reviews'], old =>
        old.map(x => (x.id === Number.parseInt(reviewId, 10) ? { ...x, ...data.values } : x))
      );

      keys.forEach(key => {
        if (matches(key)) {
          queryClient.setQueryData(key, old => ({
            ...old,
            data: [...old.data.map(x => (x.id === Number.parseInt(reviewId, 10) ? { ...x, ...data.values } : x))],
          }));
        }
      });

      queryClient.setQueryData(['reviews', reviewId], data.values);
      return previousValue;
    },
    onSuccess: () => {
      toast.success('Review updated');
      if (config?.onSuccess) {
        config.onSuccess();
      }
    },
    onError: (_, __, previousValue) => {
      queryClient.setQueryData(['reviews', reviewId], previousValue);
      toast.error('Form has errors, please check the details');
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries(['product', String(variables.values.productId), 'reviews']);
      queryClient.invalidateQueries('reviews');
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  const toast = useContext(ToastContext);
  const meta = getPersistedPagination('reviews');
  const keys = queryClient.getQueryCache().findAll('reviews');

  return useMutation(values => api.reviews.delete(values.id), {
    onMutate: values => {
      queryClient.cancelQueries('reviews');
      const previousValue = queryClient.getQueryData('reviews', { active: true });

      queryClient.setQueryData(['product', String(values.productId), 'reviews'], old =>
        old.filter(x => x.id !== values.id)
      );

      keys.forEach(key => {
        if (matches(key)) {
          queryClient.cancelQueries(key);
          const filtered = previousValue?.data?.filter(x => x.id !== values.id);
          const obj = { ...previousValue, data: [...filtered] };
          queryClient.setQueryData(key, obj);
        }
      });

      return previousValue;
    },
    onSuccess: () => {
      toast.success('Review deleted');
    },
    onError: (_, __, previousValue) => {
      queryClient.setQueryData(['reviews', meta], previousValue);
      toast.error('Error deleting the review');
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries(['product', String(variables.productId), 'reviews']);
      queryClient.invalidateQueries('reviews');
    },
  });
}
