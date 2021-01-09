import { useContext } from 'react';

import { nanoid } from 'nanoid';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from 'react-query';

import api from '../../api';
import { ToastContext } from '../../components/Toast/ToastContext';
import { getPersistedPagination, matches } from '../../utils/pagination';

export function useProduct(productID) {
  const queryClient = useQueryClient();

  return useQuery(['products', productID], () => api.products.get(productID), {
    initialData: () => queryClient.getQueryData('products')?.data?.find(x => x.id === Number.parseInt(productID, 10)),
  });
}

export function useProducts(query, config) {
  const queryClient = useQueryClient();
  const params = new URLSearchParams(query || '');
  const key = query ? ['products', query] : ['products'];

  return useQuery(key, () => api.products.getAll(params), {
    initialData: () => queryClient.getQueryData(key),
    ...config,
  });
}

export function useInfiniteProducts(query, config) {
  const params = new URLSearchParams(query || '');

  return useInfiniteQuery(
    ['products', params],
    ({ pageParam }) => {
      if (pageParam && pageParam > Number.parseInt(params.get('page'), 10)) {
        params.set('page', pageParam);
      }
      return api.products.getAll(params);
    },
    {
      getNextPageParam: lastPage => {
        if (lastPage?.meta?.pageCount > lastPage?.meta?.page) {
          return lastPage?.meta?.page + 1;
        }
      },
      ...config,
    }
  );
}

export function useSearchProducts(query, config) {
  const params = new URLSearchParams(query || '');
  return useQuery(['products', 'search'], () => api.products.search(params), config);
}

export function useFeaturedProducts(query, config) {
  const queryClient = useQueryClient();
  const params = new URLSearchParams(query || '');
  const key = query ? ['products', query, 'featured'] : ['products', 'featured'];

  return useQuery(key, () => api.products.getFeatured(params), {
    initialData: () => queryClient.getQueryData(key),
    ...config,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const toast = useContext(ToastContext);
  const meta = getPersistedPagination('products');
  const keys = queryClient.getQueryCache().findAll('products');

  return useMutation(formData => api.products.create(formData), {
    onMutate: values => {
      queryClient.cancelQueries('products');
      const previousValue = queryClient.getQueryData('products', { active: true });

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
      toast.success('Product created');
    },
    onError: (_, __, previousValue) => {
      queryClient.setQueryData(['products', meta], previousValue);
      toast.error('Form has errors, please check the details');
    },
    onSettled: () => {
      queryClient.invalidateQueries('products');
    },
  });
}

export function useUpdateProduct(productID) {
  const queryClient = useQueryClient();
  const toast = useContext(ToastContext);

  const keys = queryClient.getQueryCache().findAll('products');

  return useMutation(({ id, formData }) => api.products.update(id, formData), {
    onMutate: data => {
      queryClient.cancelQueries('products');
      const previousValue = queryClient.getQueryData(['products', productID]);

      keys.forEach(key => {
        if (matches(key)) {
          queryClient.setQueryData(key, old => ({
            ...old,
            data: [...old.data.map(x => (x.id === Number.parseInt(productID, 10) ? { ...x, ...data.values } : x))],
          }));
        }
      });

      queryClient.setQueryData(['products', productID], data.values);
      return previousValue;
    },
    onSuccess: () => {
      toast.success('Product updated');
    },
    onError: (_, __, previousValue) => {
      queryClient.setQueryData(['products', productID], previousValue);
      toast.error('Form has errors, please check the details');
    },
    onSettled: () => {
      queryClient.invalidateQueries('products');
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const toast = useContext(ToastContext);
  const meta = getPersistedPagination('products');
  const keys = queryClient.getQueryCache().findAll('products');

  return useMutation(id => api.products.delete(id), {
    onMutate: id => {
      const previousValue = queryClient.getQueryData('products', { active: true });

      keys.forEach(key => {
        if (matches(key)) {
          queryClient.cancelQueries(key);
          const filtered = previousValue?.data?.filter(x => x.id !== id);
          const obj = { ...previousValue, data: [...filtered] };
          queryClient.setQueryData(key, obj);
        }
      });

      return previousValue;
    },
    onSuccess: () => {
      toast.success('Product deleted');
    },
    onError: (_, __, previousValue) => {
      queryClient.setQueryData(['products', meta], previousValue);
      toast.error('Error deleting the product');
    },
    onSettled: () => {
      queryClient.invalidateQueries('products');
    },
  });
}

export function useProductTags(productId, cfg) {
  const queryClient = useQueryClient();

  return useQuery(['product', productId, 'tags'], () => api.products.getTags(productId), {
    initialData: () => queryClient.getQueryData(['product', productId, 'tags']),
    ...cfg,
  });
}

export function useProductImages(productId, cfg) {
  const queryClient = useQueryClient();

  return useQuery(['product', productId, 'images'], () => api.products.getImages(productId), {
    initialData: () => queryClient.getQueryData(['product', productId, 'images']),
    ...cfg,
  });
}

export function useProductReviews(productId, cfg) {
  const queryClient = useQueryClient();

  return useQuery(['product', productId, 'reviews'], () => api.products.getReviews(productId), {
    initialData: () => queryClient.getQueryData(['product', productId, 'reviews']),
    ...cfg,
  });
}
