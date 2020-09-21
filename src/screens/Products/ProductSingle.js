import React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { selectCurrentProduct, productGetImages } from '../../store/product/productSlice';

function ProductSingle() {
  const dispatch = useDispatch();
  const product = useSelector(selectCurrentProduct);

  React.useEffect(() => {
    dispatch(productGetImages(product.id));
  }, [dispatch, product.id]);

  return (
    <div>
      <div>
        <pre>{JSON.stringify(product, null, 2)}</pre>
      </div>
    </div>
  );
}

export default ProductSingle;
