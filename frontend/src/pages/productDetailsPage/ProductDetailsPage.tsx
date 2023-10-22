import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '../../redux/hook';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import ProductDetails from './ProductDetails';
import SuggestedProducts from '../../components/products/SuggestedProducts';

import Loader from '../../components/Loader';
import { getProductDetails } from '../../redux/reducers/productsSlice';
import { getEventDetails } from '../../redux/reducers/eventsSlice';
import ErrorCmp from '../../components/ErrorCmp';
import { Product, Event } from '../../utils/Interfaces';

const ProductDetailsPage = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams();

  const [productData, setProductData] = useState<Product | Event | null>();
  const [error, setError] = useState<string>('');

  const [searchParams] = useSearchParams();
  const eventData = searchParams.get('isEvent');

  useEffect(() => {
    if (eventData === 'true') {
      dispatch(getEventDetails(id!)).then(({ payload }) => {
        if (payload.success) setProductData(payload.event);
        else setError(payload.data.message);
      });
    } else {
      dispatch(getProductDetails(id!)).then(({ payload }) => {
        if (payload.success) setProductData(payload.product);
        else setError(payload.data.message);
      });
    }

    return () => {
      setProductData(null);
    };
  }, [dispatch, id, eventData]);

  if (error) {
    return (
      <>
        <Header />
        <ErrorCmp error={error} />
        <Footer />
      </>
    );
  }

  return (
    <div>
      <Header />

      {productData ? (
        <>
          <ProductDetails data={productData} isEvent={eventData || ''} />
          {!eventData && <SuggestedProducts data={productData} />}
        </>
      ) : (
        <Loader />
      )}

      <Footer />
    </div>
  );
};

export default ProductDetailsPage;
