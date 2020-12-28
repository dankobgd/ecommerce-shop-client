import { useContext } from 'react';

import { useMutation, useQuery, useQueryClient } from 'react-query';

import api from '../../api';
import { ToastContext } from '../../components/Toast/ToastContext';
import { getPersistedPagination, matches } from '../../utils/pagination';

export function usePromotion(promoCode, config) {
  const queryClient = useQueryClient();

  return useQuery(['promotions', promoCode], () => api.promotions.get(promoCode), {
    initialData: () => queryClient.getQueryData('promotions')?.data?.find(x => x.promoCode === promoCode),
    ...config,
  });
}

export function usePromotionStatus(promoCode, config) {
  return useQuery(['promotions', promoCode, 'status'], () => api.promotions.getStatus(promoCode), config);
}

export function usePromotions(query, config) {
  const queryClient = useQueryClient();
  const params = query ? new URLSearchParams(query) : undefined;
  const key = query ? ['promotions', query] : ['promotions'];

  return useQuery(key, () => api.promotions.getAll(params), {
    initialData: () => queryClient.getQueryData(key),
    ...config,
  });
}

export function useCreatePromotion() {
  const queryClient = useQueryClient();
  const toast = useContext(ToastContext);
  const meta = getPersistedPagination('promotions');
  const keys = queryClient.getQueryCache().findAll('promotions');

  return useMutation(values => api.promotions.create(values), {
    onMutate: values => {
      queryClient.cancelQueries('promotions');
      const previousValue = queryClient.getQueryData('promotions', { active: true });

      keys.forEach(key => {
        if (matches(key)) {
          queryClient.setQueryData(key, old => ({
            ...old,
            data: [...old.data, values],
          }));
        }
      });

      return previousValue;
    },
    onSuccess: () => {
      toast.success('Promotion created');
    },
    onError: (_, __, previousValue) => {
      queryClient.setQueryData(['promotions', meta], previousValue);
      toast.error('Form has errors, please check the details');
    },
    onSettled: () => {
      queryClient.invalidateQueries('promotions');
    },
  });
}

export function useUpdatePromotion(promoCode) {
  const queryClient = useQueryClient();
  const toast = useContext(ToastContext);

  const keys = queryClient.getQueryCache().findAll('promotions');

  return useMutation(({ values }) => api.promotions.update(promoCode, values), {
    onMutate: data => {
      queryClient.cancelQueries('promotions');
      const previousValue = queryClient.getQueryData(['promotions', promoCode]);

      keys.forEach(key => {
        if (matches(key)) {
          queryClient.setQueryData(key, old => ({
            ...old,
            data: [...old.data.map(x => (x.promoCode === promoCode ? { ...x, ...data.values } : x))],
          }));
        }
      });

      queryClient.setQueryData(['promotions', promoCode], data.values);
      return previousValue;
    },
    onSuccess: () => {
      toast.success('Promotion updated');
    },
    onError: (_, __, previousValue) => {
      queryClient.setQueryData(['promotions', promoCode], previousValue);
      toast.error('Form has errors, please check the details');
    },
    onSettled: () => {
      queryClient.invalidateQueries('promotions');
    },
  });
}

export function useDeletePromotion() {
  const queryClient = useQueryClient();
  const toast = useContext(ToastContext);
  const meta = getPersistedPagination('promotions');
  const keys = queryClient.getQueryCache().findAll('promotions');

  return useMutation(promoCode => api.promotions.delete(promoCode), {
    onMutate: promoCode => {
      const previousValue = queryClient.getQueryData('promotions', { active: true });

      keys.forEach(key => {
        if (matches(key)) {
          queryClient.cancelQueries(key);
          const filtered = previousValue?.data?.filter(x => x.promoCode !== promoCode);
          const obj = { ...previousValue, data: [...filtered] };
          queryClient.setQueryData(key, obj);
        }
      });

      return previousValue;
    },
    onSuccess: () => {
      toast.success('Promotion deleted');
    },
    onError: (_, __, previousValue) => {
      queryClient.setQueryData(['promotions', meta], previousValue);
      toast.error('Error deleting the promotion');
    },
    onSettled: () => {
      queryClient.invalidateQueries('promotions');
    },
  });
}
