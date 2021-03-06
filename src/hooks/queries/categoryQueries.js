import { useContext } from 'react';

import { nanoid } from 'nanoid';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import api from '../../api';
import { ToastContext } from '../../components/Toast/ToastContext';
import { getPersistedPagination, matches } from '../../utils/pagination';

export function useCategoriesCount() {
  return useQuery(['categories', 'count'], () => api.categories.count());
}

export function useCategory(categoryId) {
  const queryClient = useQueryClient();

  return useQuery(['categories', categoryId], () => api.categories.get(categoryId), {
    initialData: () => queryClient.getQueryData('categories')?.data?.find(x => x.id === Number(categoryId)),
  });
}

export function useCategories(query, config) {
  const queryClient = useQueryClient();
  const params = new URLSearchParams(query || '');
  const key = query ? ['categories', query] : ['categories'];

  return useQuery(key, () => api.categories.getAll(params), {
    initialData: () => queryClient.getQueryData(key),
    ...config,
  });
}

export function useFeaturedCategories(query, config) {
  const queryClient = useQueryClient();
  const params = new URLSearchParams(query || '');
  const key = query ? ['categories', query, 'featured'] : ['categories', 'featured'];

  return useQuery(key, () => api.categories.getFeatured(params), {
    initialData: () => queryClient.getQueryData(key),
    ...config,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  const toast = useContext(ToastContext);
  const meta = getPersistedPagination('categories');
  const keys = queryClient.getQueryCache().findAll('categories');

  return useMutation(formData => api.categories.create(formData), {
    onMutate: values => {
      queryClient.cancelQueries('categories');
      const previousValue = queryClient.getQueryData('categories', { active: true });

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
      toast.success('Category created');
    },
    onError: (_, __, previousValue) => {
      queryClient.setQueryData(['categories', meta], previousValue);
      toast.error('Form has errors, please check the details');
    },
    onSettled: () => {
      queryClient.invalidateQueries('categories');
    },
  });
}

export function useUpdateCategory(categoryId) {
  const queryClient = useQueryClient();
  const toast = useContext(ToastContext);

  const keys = queryClient.getQueryCache().findAll('categories');

  return useMutation(formData => api.categories.update(categoryId, formData), {
    onMutate: formData => {
      queryClient.cancelQueries('categories');
      const previousValue = queryClient.getQueryData(['categories', categoryId]);

      keys.forEach(key => {
        if (matches(key)) {
          queryClient.setQueryData(key, old => ({
            ...old,
            data: [...old.data.map(x => (x.id === Number(categoryId) ? { ...x, ...formData } : x))],
          }));
        }
      });

      queryClient.setQueryData(['categories', categoryId], formData);
      return previousValue;
    },
    onSuccess: () => {
      toast.success('Category updated');
    },
    onError: (_, __, previousValue) => {
      queryClient.setQueryData(['categories', categoryId], previousValue);
      toast.error('Form has errors, please check the details');
    },
    onSettled: () => {
      queryClient.invalidateQueries('categories');
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  const toast = useContext(ToastContext);
  const meta = getPersistedPagination('categories');
  const keys = queryClient.getQueryCache().findAll('categories');

  return useMutation(id => api.categories.delete(id), {
    onMutate: id => {
      const previousValue = queryClient.getQueryData('categories', { active: true });

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
      toast.success('Category deleted');
    },
    onError: (_, __, previousValue) => {
      queryClient.setQueryData(['categories', meta], previousValue);
      toast.error('Error deleting the category');
    },
    onSettled: () => {
      queryClient.invalidateQueries('categories');
    },
  });
}

export function useDeleteCategories(config) {
  const queryClient = useQueryClient();
  const toast = useContext(ToastContext);
  const meta = getPersistedPagination('categories');
  const keys = queryClient.getQueryCache().findAll('categories');

  return useMutation(ids => api.categories.bulkDelete(ids), {
    onMutate: ids => {
      const previousValue = queryClient.getQueryData('categories', { active: true });

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
      toast.success('Categories deleted');
      if (config?.onSuccess) {
        config.onSuccess();
      }
    },
    onError: (_, __, previousValue) => {
      queryClient.setQueryData(['categories', meta], previousValue);
      toast.error('Error deleting categories');
    },
    onSettled: () => {
      queryClient.invalidateQueries('categories');
    },
  });
}
