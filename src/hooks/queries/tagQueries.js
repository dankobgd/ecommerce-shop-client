import { useContext } from 'react';

import { nanoid } from 'nanoid';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import api from '../../api';
import { ToastContext } from '../../components/Toast/ToastContext';
import { getPersistedPagination, matches } from '../../utils/pagination';

export function useTagsCount() {
  return useQuery(['tags', 'count'], () => api.tags.count());
}

export function useTag(tagId) {
  const queryClient = useQueryClient();

  return useQuery(['tags', tagId], () => api.tags.get(tagId), {
    initialData: () => queryClient.getQueryData('tags')?.data?.find(x => x.id === Number(tagId)),
  });
}

export function useTags(query, config) {
  const queryClient = useQueryClient();
  const params = new URLSearchParams(query || '');
  const key = query ? ['tags', query] : ['tags'];

  return useQuery(key, () => api.tags.getAll(params), {
    initialData: () => queryClient.getQueryData(key),
    ...config,
  });
}

export function useCreateTag() {
  const queryClient = useQueryClient();
  const toast = useContext(ToastContext);
  const meta = getPersistedPagination('tags');
  const keys = queryClient.getQueryCache().findAll('tags');

  return useMutation(values => api.tags.create(values), {
    onMutate: values => {
      queryClient.cancelQueries('tags');
      const previousValue = queryClient.getQueryData('tags', { active: true });

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
      toast.success('Tag created');
    },
    onError: (_, __, previousValue) => {
      queryClient.setQueryData(['tags', meta], previousValue);
      toast.error('Form has errors, please check the details');
    },
    onSettled: () => {
      queryClient.invalidateQueries('tags');
    },
  });
}

export function useUpdateTag(tagId) {
  const queryClient = useQueryClient();
  const toast = useContext(ToastContext);

  const keys = queryClient.getQueryCache().findAll('tags');

  return useMutation(values => api.tags.update(tagId, values), {
    onMutate: values => {
      queryClient.cancelQueries('tags');
      const previousValue = queryClient.getQueryData(['tags', tagId]);

      keys.forEach(key => {
        if (matches(key)) {
          queryClient.setQueryData(key, old => ({
            ...old,
            data: [...old.data.map(x => (x.id === Number(tagId) ? { ...x, ...values } : x))],
          }));
        }
      });

      queryClient.setQueryData(['tags', tagId], values);
      return previousValue;
    },
    onSuccess: () => {
      toast.success('Tag updated');
    },
    onError: (_, __, previousValue) => {
      queryClient.setQueryData(['tags', tagId], previousValue);
      toast.error('Form has errors, please check the details');
    },
    onSettled: () => {
      queryClient.invalidateQueries('tags');
    },
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();
  const toast = useContext(ToastContext);
  const meta = getPersistedPagination('tags');
  const keys = queryClient.getQueryCache().findAll('tags');

  return useMutation(id => api.tags.delete(id), {
    onMutate: id => {
      const previousValue = queryClient.getQueryData('tags', { active: true });

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
      toast.success('Tag deleted');
    },
    onError: (_, __, previousValue) => {
      queryClient.setQueryData(['tags', meta], previousValue);
      toast.error('Error deleting the tag');
    },
    onSettled: () => {
      queryClient.invalidateQueries('tags');
    },
  });
}

export function useDeleteTags(config) {
  const queryClient = useQueryClient();
  const toast = useContext(ToastContext);
  const meta = getPersistedPagination('tags');
  const keys = queryClient.getQueryCache().findAll('tags');

  return useMutation(ids => api.tags.bulkDelete(ids), {
    onMutate: ids => {
      const previousValue = queryClient.getQueryData('tags', { active: true });

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
      toast.success('Tags deleted');
      if (config?.onSuccess) {
        config.onSuccess();
      }
    },
    onError: (_, __, previousValue) => {
      queryClient.setQueryData(['tags', meta], previousValue);
      toast.error('Error deleting tags');
    },
    onSettled: () => {
      queryClient.invalidateQueries('tags');
    },
  });
}
