import React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { selectBrandById } from '../../store/brand/brandSlice';
import { selectCurrentProduct } from '../../store/product/productSlice';
import { imageGetAllForProduct, selectManyProductImages } from '../../store/product_image/productImageSlice';
import { reviewGetAllForProduct, selectManyReviews } from '../../store/review/reviewSlice';
import { tagGetAllForProduct, selectManyTags } from '../../store/tag/tagSlice';

function ProductSingle() {
  const dispatch = useDispatch();
  const product = useSelector(selectCurrentProduct);
  const brand = useSelector(s => selectBrandById(s, product.brand));
  const tags = useSelector(selectManyTags(product?.tags || []));
  const images = useSelector(selectManyProductImages(product?.images || []));
  const reviews = useSelector(selectManyReviews(product?.reviews || []));

  React.useEffect(() => {
    dispatch(imageGetAllForProduct(product.id));
    dispatch(reviewGetAllForProduct(product.id));
    dispatch(tagGetAllForProduct(product.id));
  }, [dispatch, product.id]);

  return (
    <div>
      <div>
        <pre>product: {JSON.stringify(product && product, null, 2)}</pre>
        <pre>brand: {JSON.stringify(brand && brand, null, 2)}</pre>
        <pre>tags: {JSON.stringify(tags && tags, null, 2)}</pre>
        <pre>images: {JSON.stringify(images && images, null, 2)}</pre>
        <pre>reviews: {JSON.stringify(reviews && reviews, null, 2)}</pre>
      </div>
    </div>
  );
}

export default ProductSingle;
