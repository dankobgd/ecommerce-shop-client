import { useContext } from 'react';

import { nanoid } from 'nanoid';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import api from '../../api';
import { ToastContext } from '../../components/Toast/ToastContext';
import { getPersistedPagination, matches } from '../../utils/pagination';

export function useBrand(brandId) {
  const queryClient = useQueryClient();

  return useQuery(['brands', brandId], () => api.brands.get(brandId), {
    initialData: () => queryClient.getQueryData('brands')?.data?.find(x => x.id === Number(brandId)),
  });
}

export function useBrands(query, config) {
  const queryClient = useQueryClient();
  const params = new URLSearchParams(query || '');
  const key = query ? ['brands', query] : ['brands'];

  return useQuery(key, () => api.brands.getAll(params), {
    initialData: () => queryClient.getQueryData(key),
    ...config,
  });
}

export function useCreateBrand() {
  const queryClient = useQueryClient();
  const toast = useContext(ToastContext);
  const meta = getPersistedPagination('brands');
  const keys = queryClient.getQueryCache().findAll('brands');

  return useMutation(formData => api.brands.create(formData), {
    onMutate: values => {
      queryClient.cancelQueries('brands');
      const previousValue = queryClient.getQueryData('brands', { active: true });

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
      toast.success('Brand created');
    },
    onError: (_, __, previousValue) => {
      queryClient.setQueryData(['brands', meta], previousValue);
      toast.error('Form has errors, please check the details');
    },
    onSettled: () => {
      queryClient.invalidateQueries('brands');
    },
  });
}

export function useUpdateBrand(brandId) {
  const queryClient = useQueryClient();
  const toast = useContext(ToastContext);

  const keys = queryClient.getQueryCache().findAll('brands');

  return useMutation(formData => api.brands.update(brandId, formData), {
    onMutate: formData => {
      queryClient.cancelQueries('brands');
      const previousValue = queryClient.getQueryData(['brands', brandId]);

      keys.forEach(key => {
        if (matches(key)) {
          queryClient.setQueryData(key, old => ({
            ...old,
            data: [...old.data.map(x => (x.id === Number(brandId) ? { ...x, ...formData } : x))],
          }));
        }
      });

      queryClient.setQueryData(['brands', brandId], formData);
      return previousValue;
    },
    onSuccess: () => {
      toast.success('Brand updated');
    },
    onError: (_, __, previousValue) => {
      queryClient.setQueryData(['brands', brandId], previousValue);
      toast.error('Form has errors, please check the details');
    },
    onSettled: () => {
      queryClient.invalidateQueries('brands');
    },
  });
}

export function useDeleteBrand() {
  const queryClient = useQueryClient();
  const toast = useContext(ToastContext);
  const meta = getPersistedPagination('brands');
  const keys = queryClient.getQueryCache().findAll('brands');

  return useMutation(id => api.brands.delete(id), {
    onMutate: id => {
      const previousValue = queryClient.getQueryData('brands', { active: true });

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
      toast.success('Brand deleted');
    },
    onError: (_, __, previousValue) => {
      queryClient.setQueryData(['brands', meta], previousValue);
      toast.error('Error deleting the brand');
    },
    onSettled: () => {
      queryClient.invalidateQueries('brands');
    },
  });
}

export function useDeleteBrands(config) {
  const queryClient = useQueryClient();
  const toast = useContext(ToastContext);
  const meta = getPersistedPagination('brands');
  const keys = queryClient.getQueryCache().findAll('brands');

  return useMutation(ids => api.brands.bulkDelete(ids), {
    onMutate: ids => {
      const previousValue = queryClient.getQueryData('brands', { active: true });

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
      toast.success('Brands deleted');
      if (config?.onSuccess) {
        config.onSuccess();
      }
    },
    onError: (_, __, previousValue) => {
      queryClient.setQueryData(['brands', meta], previousValue);
      toast.error('Error deleting brands');
    },
    onSettled: () => {
      queryClient.invalidateQueries('brands');
    },
  });
}
