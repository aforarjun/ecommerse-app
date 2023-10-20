import { useEffect, useState } from 'react';
import { Link, Route, Routes, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import styles from '../../../styles/styles';
import ProductCard from '../../../components/products/ProductCard';
import Ratings from '../../../components/products/Ratings';
import { getSellerProducts } from '../../../redux/reducers/productsSlice';
import { getSellerEvents } from '../../../redux/reducers/eventsSlice';
import ErrorPage from '../../ErrorPage';

const ShopProfileData = ({ isOwner }: { isOwner: boolean }) => {
  const { products } = useAppSelector((state) => state.products);
  const { events } = useAppSelector((state) => state.events);
  const dispatch = useAppDispatch();
  const { id }: any = useParams();

  useEffect(() => {
    dispatch(getSellerProducts(id));
    dispatch(getSellerEvents(id));
  }, [dispatch, id]);

  const [active, setActive] = useState<number>(1);

  const allReviews = products && products.map((product: any) => product.reviews).flat();

  const tabs = [
    {
      id: '1',
      name: 'Shop Products',
      link: `/${isOwner ? 'seller' : 'shop/preview'}/${id}/shopProducts`,
      activeTab: 1
    },
    {
      id: '2',
      name: 'Running Events',
      link: `/${isOwner ? 'seller' : 'shop/preview'}/${id}/runningEvents`,
      activeTab: 2
    },
    {
      id: '3',
      name: 'Shop Reviews',
      link: `/${isOwner ? 'seller' : 'shop/preview'}/${id}/shopReviews`,
      activeTab: 3
    }
  ] as {
    id: string;
    name: string;
    link: string;
    activeTab: number;
  }[];

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <div className="w-full flex">
          {tabs.map(({ id, name, link, activeTab }) => (
            <Link to={link} key={id}>
              <div className="flex items-center" onClick={() => setActive(activeTab)}>
                <h5
                  className={`font-[600] text-[20px] ${
                    active === activeTab ? 'text-red-500' : 'text-[#333]'
                  } cursor-pointer pr-[20px]`}>
                  {name}
                </h5>
              </div>
            </Link>
          ))}
        </div>

        <div>
          {isOwner && (
            <Link to="/seller/dashboard">
              <div className={`${styles.button} !rounded-[4px] h-[42px]`}>
                <span className="text-[#fff]">Go Dashboard</span>
              </div>
            </Link>
          )}
        </div>
      </div>

      <br />

      <Routes>
        <Route path="/" element={<ShopProducts products={products} />} />
        <Route path="/shopProducts" element={<ShopProducts products={products} />} />
        <Route path="/runningEvents" element={<RunningEvents events={events} />} />
        <Route path="/shopReviews" element={<ShopReviews allReviews={allReviews} />} />

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
};

const ShopProducts = ({ products }: any) => (
  <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] xl:grid-cols-4 xl:gap-[20px] mb-12 border-0">
    {products.length ? (
      products.map((i: any, index: number) => <ProductCard data={i} key={index} isShop={true} />)
    ) : (
      <h5 className="w-full text-center py-5 text-[18px]">No Product listed for this shop!</h5>
    )}
  </div>
);

const RunningEvents = ({ events }: any) => (
  <div className="w-full">
    <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] xl:grid-cols-4 xl:gap-[20px] mb-12 border-0">
      {events.length ? (
        events.map((event: any, index: number) => (
          <ProductCard data={event} key={index} isShop={true} isEvent={true} />
        ))
      ) : (
        <h5 className="w-full text-center py-5 text-[18px]">No Events have for this shop!</h5>
      )}
    </div>
  </div>
);

const ShopReviews = ({ allReviews }: any) => (
  <div className="w-full">
    {allReviews.length ? (
      allReviews.map((review: any, index: number) => (
        <div className="w-full flex my-4" key={index}>
          <img
            src={`${review.user.avatar?.url}`}
            className="w-[50px] h-[50px] rounded-full"
            alt=""
          />
          <div className="pl-2">
            <div className="flex w-full items-center">
              <h1 className="font-[600] pr-2">{review.user.name}</h1>
              <Ratings rating={review.rating} />
            </div>
            <p className="font-[400] text-[#000000a7]">{review?.comment}</p>
            <p className="text-[#000000a7] text-[14px]">{'2days ago'}</p>
          </div>
        </div>
      ))
    ) : (
      <h5 className="w-full text-center py-5 text-[18px]">No Reviews have for this shop!</h5>
    )}
  </div>
);

export default ShopProfileData;
