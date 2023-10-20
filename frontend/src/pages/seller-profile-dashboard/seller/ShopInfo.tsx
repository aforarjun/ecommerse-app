import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styles from '../../../styles/styles';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import { axiosInstance } from '../../../server';
import Loader from '../../../components/Loader';
import { logoutSeller } from '../../../redux/reducers/sellerSlice';
import { getSellerProducts } from '../../../redux/reducers/productsSlice';
import { Seller } from '../../../utils/Interfaces';

const ShopInfo = ({ isOwner }: { isOwner: boolean }) => {
  const { products } = useAppSelector((state) => state.products);
  const dispatch = useAppDispatch();
  const { id }: any = useParams();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<Seller>();

  useEffect(() => {
    dispatch(getSellerProducts(id));

    setIsLoading(true);
    axiosInstance
      .get(`/seller/get-seller/${id}`, {
        withCredentials: true
      })
      .then((res) => {
        setData(res.data.seller);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, [dispatch, id]);

  const logoutHandler = async () => {
    await dispatch(logoutSeller());
    window.location.reload();
  };

  const totalReviewsLength =
    products && products.reduce((acc: number, product: any) => acc + product?.reviews.length, 0);

  const totalRatings =
    products &&
    products.reduce(
      (acc: number, product: any) =>
        acc + product.reviews.reduce((sum: number, review: any) => sum + review.rating, 0),
      0
    );

  const averageRating = totalRatings / totalReviewsLength || 0;

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <div className="w-full py-5">
            <div className="w-full flex item-center justify-center">
              <img
                src={`${data?.avatar}`}
                alt=""
                className="w-[150px] h-[150px] object-cover rounded-full"
              />
            </div>
            <h3 className="text-center py-2 text-[15px]">{data?.name}</h3>
            <h3 className="text-center py-2 text-[20px]">{data?.shopName}</h3>
            <p className="text-[16px] text-[#000000a6] p-[10px] flex items-center">
              {data?.description}
            </p>
          </div>
          <div className="p-3">
            <h5 className="font-[600]">Address</h5>
            <h4 className="text-[#000000a6]">
              <span>{data?.address.address1}</span>
              <br />
              <span>{data?.address.address2}</span>
              <br />
              <span>
                {data?.address.city.value}, {data?.address.country.value}
              </span>
              <br />
            </h4>
          </div>
          <div className="p-3">
            <h5 className="font-[600]">Phone Number</h5>
            <h4 className="text-[#000000a6]">{data?.phoneNumber}</h4>
          </div>
          <div className="p-3">
            <h5 className="font-[600]">Total Products</h5>
            <h4 className="text-[#000000a6]">{products && products.length}</h4>
          </div>
          <div className="p-3">
            <h5 className="font-[600]">Shop Ratings</h5>
            <h4 className="text-[#000000b0]">{averageRating}/5</h4>
          </div>
          <div className="p-3">
            <h5 className="font-[600]">Joined On</h5>
            <h4 className="text-[#000000b0]">{data?.createdAt.toString().slice(0, 10)}</h4>
          </div>

          {isOwner && (
            <div className="py-3 px-4">
              <Link to="/seller/dashboard/settings">
                <div className={`${styles.button} !w-full !h-[42px] !rounded-[5px]`}>
                  <span className="text-white">Edit Shop</span>
                </div>
              </Link>
              <div
                className={`${styles.button} !w-full !h-[42px] !rounded-[5px]`}
                onClick={logoutHandler}>
                <span className="text-white">Log Out</span>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ShopInfo;
