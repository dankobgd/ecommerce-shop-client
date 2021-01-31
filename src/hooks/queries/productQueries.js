import { useContext } from 'react';

import { nanoid } from 'nanoid';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from 'react-query';

import api from '../../api';
import { ToastContext } from '../../components/Toast/ToastContext';
import { getPersistedPagination, matches } from '../../utils/pagination';

export function useProduct(productId) {
  const queryClient = useQueryClient();

  return useQuery(['products', productId], () => api.products.get(productId), {
    initialData: () => queryClient.getQueryData('products')?.data?.find(x => x.id === Number(productId)),
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
      if (!query || (query && !params.get('page'))) {
        params.set('page', 1);
      }
      if (!query || (query && !params.get('per_page'))) {
        params.set('per_page', 20);
      }

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

export function useUpdateProduct(productId) {
  const queryClient = useQueryClient();
  const toast = useContext(ToastContext);

  const keys = queryClient.getQueryCache().findAll('products');

  return useMutation(formData => api.products.update(productId, formData), {
    onMutate: formData => {
      queryClient.cancelQueries('products');
      const previousValue = queryClient.getQueryData(['products', productId]);

      keys.forEach(key => {
        if (matches(key)) {
          queryClient.setQueryData(key, old => ({
            ...old,
            data: [...old.data.map(x => (x.id === Number(productId) ? { ...x, ...formData } : x))],
          }));
        }
      });

      queryClient.setQueryData(['products', productId], formData);
      return previousValue;
    },
    onSuccess: () => {
      toast.success('Product updated');
    },
    onError: (_, __, previousValue) => {
      queryClient.setQueryData(['products', productId], previousValue);
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
          const obj = { ...previousValue, data: filtered };
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

export function useDeleteProducts(config) {
  const queryClient = useQueryClient();
  const toast = useContext(ToastContext);
  const meta = getPersistedPagination('products');
  const keys = queryClient.getQueryCache().findAll('products');

  return useMutation(ids => api.products.bulkDelete(ids), {
    onMutate: ids => {
      const previousValue = queryClient.getQueryData('products', { active: true });

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
      toast.success('Products deleted');
      if (config?.onSuccess) {
        config.onSuccess();
      }
    },
    onError: (_, __, previousValue) => {
      queryClient.setQueryData(['products', meta], previousValue);
      toast.error('Error deleting products');
    },
    onSettled: () => {
      queryClient.invalidateQueries('products');
    },
  });
}

export function useInsertPricing(productId) {
  const queryClient = useQueryClient();
  const toast = useContext(ToastContext);

  const keys = queryClient.getQueryCache().findAll('products');

  return useMutation(values => api.products.insertPricing(productId, values), {
    onMutate: values => {
      queryClient.cancelQueries('products');
      const previousValue = queryClient.getQueryData(['products', productId]);

      keys.forEach(key => {
        if (matches(key)) {
          queryClient.setQueryData(key, old => ({
            ...old,
            data: [...old.data.map(x => (x.id === Number(productId) ? { ...x, ...values } : x))],
          }));
        }
      });

      queryClient.setQueryData(['products', productId], values);
      return previousValue;
    },
    onSuccess: () => {
      toast.success('Pricing updated');
    },
    onError: (_, __, previousValue) => {
      queryClient.setQueryData(['products', productId], previousValue);
      toast.error('Form has errors, please check the details');
    },
    onSettled: () => {
      queryClient.invalidateQueries('products');
    },
  });
}

// Product Tag Queries

export function useCreateProductTag(productId, config) {
  const queryClient = useQueryClient();
  const toast = useContext(ToastContext);

  return useMutation(values => api.products.createTag(productId, values), {
    onMutate: values => {
      queryClient.cancelQueries(['product', productId, 'tags']);
      const previousValue = queryClient.getQueryData(['product', productId, 'tags']);
      queryClient.setQueryData(['product', productId, 'tags'], old => [...old, { id: nanoid(), ...values }]);
      return previousValue;
    },
    onSuccess: () => {
      toast.success('Product tag created');
      if (config?.onSuccess) {
        config.onSuccess();
      }
    },
    onError: (_, __, previousValue) => {
      queryClient.setQueryData(['product', productId, 'tags'], previousValue);
      toast.error('Form has errors, please check the details');
    },
    onSettled: () => {
      queryClient.invalidateQueries(['product', productId, 'tags']);
    },
  });
}

export function useUpdateProductTags(productId) {
  const queryClient = useQueryClient();
  const toast = useContext(ToastContext);

  return useMutation(values => api.products.replaceTags(productId, values), {
    onSuccess: () => {
      toast.success('Product tags updated');
    },
    onSettled: () => {
      queryClient.invalidateQueries(['product', productId, 'tags']);
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

export function useDeleteProductTag() {
  const queryClient = useQueryClient();
  const toast = useContext(ToastContext);

  return useMutation(values => api.products.deleteTag(values.productId, values.tagId), {
    onMutate: values => {
      const previousValue = queryClient.getQueryData(['product', values.productId, 'tags']);
      const filtered = previousValue?.filter(x => x.tagId !== values.tagId);
      queryClient.setQueryData(['product', values.productId, 'tags'], filtered);
      return previousValue;
    },
    onSuccess: () => {
      toast.success('Product tag deleted');
    },
    onError: (_, variables, previousValue) => {
      queryClient.setQueryData(['product', variables.productId, 'tags'], previousValue);
      toast.error('Error deleting the product tag');
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries(['product', variables.productId, 'tags']);
    },
  });
}

export function useDeleteProductTags(config) {
  const queryClient = useQueryClient();
  const toast = useContext(ToastContext);

  return useMutation(values => api.products.bulkDeleteTags(values.productId, values.ids), {
    onMutate: values => {
      const previousValue = queryClient.getQueryData(['product', values.productId, 'tags']);
      const filtered = previousValue?.filter(x => !values.ids.includes(x.tagId));
      queryClient.setQueryData(['product', values.productId, 'tags'], filtered);
      return previousValue;
    },
    onSuccess: () => {
      toast.success('Product tags deleted');
      if (config?.onSuccess) {
        config.onSuccess();
      }
    },
    onError: (_, variables, previousValue) => {
      queryClient.setQueryData(['product', variables.productId, 'tags'], previousValue);
      toast.error('Error deleting product tags');
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries(['product', variables.productId, 'tags']);
    },
  });
}

// Product Image Queries

export function useCreateProductImages(productId, config) {
  const queryClient = useQueryClient();
  const toast = useContext(ToastContext);

  return useMutation(formData => api.products.createImages(productId, formData), {
    onSuccess: () => {
      toast.success('Product images created');
      if (config?.onSuccess) {
        config.onSuccess();
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(['product', productId, 'images']);
    },
  });
}

export function useCreateProductImage(productId, config) {
  const queryClient = useQueryClient();
  const toast = useContext(ToastContext);

  return useMutation(formData => api.products.createImage(productId, formData), {
    onMutate: formData => {
      queryClient.cancelQueries(['product', productId, 'images']);
      const previousValue = queryClient.getQueryData(['product', productId, 'images']);
      queryClient.setQueryData(['product', productId, 'images'], old => [...old, { id: nanoid(), ...formData }]);
      return previousValue;
    },
    onSuccess: () => {
      toast.success('Product image created');
      if (config?.onSuccess) {
        config.onSuccess();
      }
    },
    onError: (_, __, previousValue) => {
      queryClient.setQueryData(['product', productId, 'images'], previousValue);
      toast.error('Form has errors, please check the details');
    },
    onSettled: () => {
      queryClient.invalidateQueries(['product', productId, 'images']);
    },
  });
}

export function useProductImages(productId, cfg) {
  const queryClient = useQueryClient();

  return useQuery(['product', productId, 'images'], () => api.products.getImages(productId), {
    initialData: () => queryClient.getQueryData(['product', productId, 'images']),
    ...cfg,
  });
}

export function useUpdateProductImage(productId, imageId) {
  const queryClient = useQueryClient();
  const toast = useContext(ToastContext);

  return useMutation(formData => api.products.updateImage(productId, imageId, formData), {
    onSuccess: () => {
      toast.success('Image updated');
    },
    onError: () => {
      toast.error('Form has errors, please check the details');
    },
    onSettled: () => {
      queryClient.invalidateQueries(['product', productId, 'images']);
    },
  });
}

export function useDeleteProductImage() {
  const queryClient = useQueryClient();
  const toast = useContext(ToastContext);

  return useMutation(values => api.products.deleteImage(values.productId, values.imageId), {
    onMutate: values => {
      const previousValue = queryClient.getQueryData(['product', values.productId, 'images']);
      const filtered = previousValue?.filter(x => x.id !== Number(values.imageId));
      queryClient.setQueryData(['product', values.productId, 'images'], filtered);
      return previousValue;
    },
    onSuccess: () => {
      toast.success('Product image deleted');
    },
    onError: (_, variables, previousValue) => {
      queryClient.setQueryData(['product', variables.productId, 'images'], previousValue);
      toast.error('Error deleting the product image');
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries(['product', variables.productId, 'images']);
    },
  });
}

// Product Review Queries

export function useCreateProductReview(productId, config) {
  const queryClient = useQueryClient();
  const toast = useContext(ToastContext);

  return useMutation(values => api.products.createReview(productId, values), {
    onMutate: values => {
      queryClient.cancelQueries(['product', productId, 'reviews']);
      const previousValue = queryClient.getQueryData(['product', productId, 'reviews']);
      queryClient.setQueryData(['product', productId, 'reviews'], old => [...old, { id: nanoid(), ...values }]);
      return previousValue;
    },
    onSuccess: () => {
      toast.success('Product review created');
      if (config?.onSuccess) {
        config.onSuccess();
      }
    },
    onError: (_, __, previousValue) => {
      queryClient.setQueryData(['product', productId, 'reviews'], previousValue);
      toast.error('Form has errors, please check the details');
    },
    onSettled: () => {
      queryClient.invalidateQueries(['product', productId, 'reviews']);
    },
  });
}

export function useUpdateProductReview(productId, reviewId, config) {
  const queryClient = useQueryClient();
  const toast = useContext(ToastContext);

  return useMutation(values => api.products.updateReview(productId, reviewId, values), {
    onMutate: values => {
      queryClient.cancelQueries(['product', productId, 'reviews']);
      const previousValue = queryClient.getQueryData(['product', productId, 'reviews']);

      queryClient.setQueryData(['product', productId, 'reviews'], old => [
        ...old.map(x => (x.id === Number(reviewId) ? { ...x, ...values } : x)),
      ]);

      queryClient.setQueryData(['product', productId, 'reviews', reviewId], values);
      return previousValue;
    },
    onSuccess: () => {
      toast.success('Review updated');
      if (config?.onSuccess) {
        config.onSuccess();
      }
    },
    onError: (_, __, previousValue) => {
      queryClient.setQueryData(['product', productId, 'reviews'], previousValue);
      toast.error('Form has errors, please check the details');
    },
    onSettled: () => {
      queryClient.invalidateQueries(['product', productId, 'reviews']);
      queryClient.invalidateQueries(['product', productId, 'reviews', reviewId]);
    },
  });
}

export function useProductReviews(productId, cfg) {
  const queryClient = useQueryClient();

  return useQuery(['product', productId, 'reviews'], () => api.products.getReviews(productId), {
    initialData: () => queryClient.getQueryData(['product', productId, 'reviews']),
    ...cfg,
  });
}

export function useProductReview(productId, reviewId, cfg) {
  const queryClient = useQueryClient();

  return useQuery(['product', productId, 'reviews', reviewId], () => api.products.getReview(productId, reviewId), {
    initialData: () => queryClient.getQueryData(['product', productId, 'reviews', reviewId]),
    ...cfg,
  });
}

export function useDeleteProductReview(config) {
  const queryClient = useQueryClient();
  const toast = useContext(ToastContext);

  return useMutation(values => api.products.deleteReview(values.productId, values.reviewId), {
    onMutate: values => {
      const previousValue = queryClient.getQueryData(['product', values.productId, 'reviews']);
      const filtered = previousValue?.filter(x => x.id !== values.reviewId);
      queryClient.setQueryData(['product', values.productId, 'reviews'], filtered);
      return previousValue;
    },
    onSuccess: () => {
      toast.success('Product review deleted');
      if (config?.onSuccess) {
        config.onSuccess();
      }
    },
    onError: (_, variables, previousValue) => {
      queryClient.setQueryData(['product', variables.productId, 'reviews'], previousValue);
      toast.error('Error deleting the product review');
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries(['product', variables.productId, 'reviews']);
    },
  });
}

export function useDeleteProductReviews(config) {
  const queryClient = useQueryClient();
  const toast = useContext(ToastContext);

  return useMutation(values => api.products.bulkDeleteReviews(values.productId, values.ids), {
    onMutate: values => {
      const previousValue = queryClient.getQueryData(['product', values.productId, 'reviews']);
      const filtered = previousValue?.filter(x => !values.ids.includes(x.id));
      queryClient.setQueryData(['product', values.productId, 'reviews'], filtered);
      return previousValue;
    },
    onSuccess: () => {
      toast.success('Product reviews deleted');
      if (config?.onSuccess) {
        config.onSuccess();
      }
    },
    onError: (_, variables, previousValue) => {
      queryClient.setQueryData(['product', variables.productId, 'reviews'], previousValue);
      toast.error('Error deleting product reviews');
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries(['product', variables.productId, 'reviews']);
    },
  });
}
