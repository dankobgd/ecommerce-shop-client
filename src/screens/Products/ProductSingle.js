import React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { selectBrandById } from '../../store/brand/brandSlice';
import { selectCurrentProduct, productGetImages } from '../../store/product/productSlice';

function ProductSingle() {
  const dispatch = useDispatch();
  const product = useSelector(selectCurrentProduct);
  const brand = useSelector(s => selectBrandById(s, product.brand));

  React.useEffect(() => {
    if (product) {
      dispatch(productGetImages(product.id));
    }
  }, [dispatch, product]);

  return (
    <div>
      <div>
        <pre>{JSON.stringify(product && product, null, 2)}</pre>
        <pre>{JSON.stringify(brand && brand, null, 2)}</pre>
      </div>
    </div>
  );
}

export default ProductSingle;
