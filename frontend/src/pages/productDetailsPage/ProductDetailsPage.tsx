import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useAppSelector } from '../../redux/hook';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import ProductDetails from './ProductDetails';
import SuggestedProduct from '../../components/products/SuggestedProduct';
import { Event, Product } from '../../utils/Interfaces';
import Loader from '../../components/Loader';

const ProductDetailsPage = () => {
  const { allProducts } = useAppSelector((state) => state.products);
  const { allEvents } = useAppSelector((state) => state.events);
  const { id } = useParams();

  const [detailData, setDetailData] = useState<Product>();

  const [searchParams] = useSearchParams();
  const eventData = searchParams.get('isEvent');

  useEffect(() => {
    if (!eventData) {
      const data = allProducts?.find((product: Product) => product?._id === id);
      setDetailData(data);
    }
  }, [allProducts, allEvents]);

  return (
    <div>
      <Header />
      {detailData ? <ProductDetails data={detailData} /> : <Loader />}
      {!eventData && (detailData ? <SuggestedProduct data={detailData} /> : <Loader />)}
      <Footer />
    </div>
  );
};

export default ProductDetailsPage;
