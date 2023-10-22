import { useEffect, useState } from 'react';
import { AiOutlineMessage, AiOutlineShoppingCart } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../../styles/styles';
import { toast } from 'react-toastify';
import Ratings from '../../components/products/Ratings';
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { axiosInstance } from '../../server';
import { getSellerProducts } from '../../redux/reducers/productsSlice';
import { Product, Event } from '../../utils/Interfaces';
import { addToCart } from '../../redux/reducers/cartSlice';
// import CountDown from '../../components/events/CountDown';
// import { addToWishlist, removeFromWishlist } from '../../redux/reducers/wishlistSlice';

type DataType = {
  isEvent: string;
  data: Product | Event;
};

const ProductDetails = ({ data, isEvent }: DataType) => {
  const { user, isAuthenticated } = useAppSelector((state) => state.user);
  const { products } = useAppSelector((state) => state.products);
  const { wishlist } = useAppSelector((state) => state.wishlist);
  const { cart } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

  // const [click, setClick] = useState(false);
  const [select, setSelect] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getSellerProducts(data?.sellerId));

    // if (wishlist?.find((i: any) => i?._id === data?._id)) {
    //   setClick(true);
    // } else {
    //   setClick(false);
    // }
  }, [data, wishlist, dispatch]);

  // const removeFromWishlistHandler = (data: any) => {
  //   setClick(!click);
  //   dispatch(removeFromWishlist(data));
  // };

  // const addToWishlistHandler = (data: any) => {
  //   setClick(!click);
  //   dispatch(addToWishlist(data));
  // };

  const addToCartHandler = (id: any) => {
    const isItemExists = cart.find(({ cartItem }: any) => cartItem._id === id);

    if (isItemExists) {
      toast.error('Item already in cart!');
    } else {
      if (Number(data?.stock) < 1) {
        toast.error('Product stock limited!');
      } else {
        dispatch(addToCart(data));
        toast.success('Item added to cart successfully!');
      }
    }
  };

  const totalReviewsLength = products?.reduce(
    (acc: any, product: any) => acc + product.reviews.length,
    0
  );

  const totalRatings = products?.reduce(
    (acc: any, product: any) =>
      acc + product.reviews.reduce((sum: any, review: any) => sum + review.rating, 0),
    0
  );

  const avg = totalRatings / totalReviewsLength || 0;

  const averageRating = avg.toFixed(2);

  const handleMessageSubmit = async () => {
    if (isAuthenticated) {
      const groupTitle = `${data?._id} + ${user?._id}`;
      const userId = user?._id;
      const sellerId = data.seller._id;
      await axiosInstance
        .post(`/conversation/create-new-conversation`, {
          groupTitle,
          userId,
          sellerId
        })
        .then((res) => {
          navigate(`/inbox?${res.data.conversation._id}`);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    } else {
      toast.error('Please login to create a conversation');
    }
  };

  return (
    <div className="bg-white">
      {data ? (
        <div className={`${styles.section} w-[90%] 800px:w-[80%]`}>
          <div className="w-full py-5">
            <div className="block w-full 800px:flex">
              <div className="w-full 800px:w-[50%] flex flex-col gap-4">
                <img src={`${data?.images[select]}`} alt="" className="w-[80%]" />
                <div className="w-full flex gap-2">
                  {data?.images.map((i: any, index: number) => (
                    <div
                      className={`${
                        select === 0 ? 'border' : 'null'
                      } cursor-pointer w-[100px] h-[100px]`}>
                      <img
                        src={`${i}`}
                        alt=""
                        className="overflow-hidden mr-3 mt-3 object-contain w-[100%] h-[100%]"
                        onClick={() => setSelect(index)}
                      />
                    </div>
                  ))}
                  <div className={`${select === 1 ? 'border' : 'null'} cursor-pointer`}></div>
                </div>
              </div>
              <div className="w-full 800px:w-[50%] pt-5">
                <h1 className={`${styles.productTitle}`}>{data.name}</h1>
                <p>{data.description}</p>
                <div className="flex pt-3">
                  <h4 className={`${styles.productDiscountPrice}`}>
                    {Number(data?.discountPrice)}$
                  </h4>
                  <h3 className={`${styles.price}`}>
                    {data.originalPrice ? data.originalPrice + '$' : null}
                  </h3>
                </div>

                {isEvent && (
                  <div>
                    <span className="font-semibold mt-2 text-green-700">Event is going on!</span>
                    {/* <p>{data?.endDate > Date.now()}</p> */}
                  </div>
                )}

                <div
                  className={`${styles.button} !mt-6 !rounded !h-11 flex items-center`}
                  onClick={() => addToCartHandler(data._id)}>
                  <span className="text-white flex items-center">
                    Add to cart <AiOutlineShoppingCart className="ml-1" />
                  </span>
                </div>
                <div className="flex items-center pt-8">
                  <Link to={`/shop/preview/${data?.seller._id}`}>
                    <img
                      src={`${data?.seller?.avatar}`}
                      alt=""
                      className="w-[50px] h-[50px] rounded-full mr-2"
                    />
                  </Link>
                  <div className="pr-8">
                    <Link to={`/shop/preview/${data?.seller._id}`}>
                      <h3 className={`${styles.shop_name} pb-1 pt-1`}>{data.seller.shopName}</h3>
                    </Link>
                    <h5 className="pb-3 text-[15px]">({averageRating}/5) Ratings</h5>
                  </div>
                  <div
                    className={`${styles.button} bg-[#6443d1] mt-4 !rounded !h-11`}
                    onClick={handleMessageSubmit}>
                    <span className="text-white flex items-center">
                      Send Message <AiOutlineMessage className="ml-1" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ProductDetailsInfo
            data={data}
            products={products}
            totalReviewsLength={totalReviewsLength}
            averageRating={averageRating}
          />
          <br />
          <br />
        </div>
      ) : null}
    </div>
  );
};

const ProductDetailsInfo = ({
  data,
  products,
  totalReviewsLength,
  averageRating
}: {
  data: Product | Event;
  products: Product[];
  totalReviewsLength: string;
  averageRating: string;
}) => {
  const [active, setActive] = useState(1);

  return (
    <div className="bg-[#f5f6fb] px-3 800px:px-10 py-2 rounded">
      <div className="w-full flex justify-between border-b pt-10 pb-2">
        <div className="relative">
          <h5
            className={
              'text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]'
            }
            onClick={() => setActive(1)}>
            Product Details
          </h5>
          {active === 1 ? <div className={`${styles.active_indicator}`} /> : null}
        </div>
        <div className="relative">
          <h5
            className={
              'text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]'
            }
            onClick={() => setActive(2)}>
            Product Reviews
          </h5>
          {active === 2 ? <div className={`${styles.active_indicator}`} /> : null}
        </div>
        <div className="relative">
          <h5
            className={
              'text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]'
            }
            onClick={() => setActive(3)}>
            Seller Information
          </h5>
          {active === 3 ? <div className={`${styles.active_indicator}`} /> : null}
        </div>
      </div>
      {active === 1 ? (
        <>
          <p className="py-2 text-[18px] leading-8 pb-10 whitespace-pre-line">{data.description}</p>
        </>
      ) : null}

      {active === 2 ? (
        <div className="w-full min-h-[40vh] flex flex-col items-center py-3 overflow-y-scroll">
          {data &&
            data?.reviews?.map((item: any) => (
              <div className="w-full flex my-2">
                <img
                  src={`${item.user.avatar?.url}`}
                  alt=""
                  className="w-[50px] h-[50px] rounded-full"
                />
                <div className="pl-2 ">
                  <div className="w-full flex items-center">
                    <h1 className="font-[500] mr-3">{item.user.name}</h1>
                    <Ratings rating={data?.ratings} />
                  </div>
                  <p>{item.comment}</p>
                </div>
              </div>
            ))}

          <div className="w-full flex justify-center">
            {data?.reviews.length === 0 && <h5>No Reviews have for this product!</h5>}
          </div>
        </div>
      ) : null}

      {active === 3 && (
        <div className="w-full block 800px:flex p-5">
          <div className="w-full 800px:w-[50%]">
            <Link to={`/shop/preview/${data.seller._id}`}>
              <div className="flex items-center">
                <img
                  src={`${data?.seller?.avatar}`}
                  className="w-[50px] h-[50px] rounded-full"
                  alt=""
                />
                <div className="pl-3">
                  <h3 className={`${styles.shop_name}`}>{data.seller.shopName}</h3>
                  <h5 className="pb-2 text-[15px]">({averageRating}/5) Ratings</h5>
                </div>
              </div>
            </Link>
            <p className="pt-2">{data.seller.description}</p>
          </div>
          <div className="w-full 800px:w-[50%] mt-5 800px:mt-0 800px:flex flex-col items-end">
            <div className="text-left">
              <h5 className="font-[600]">
                Joined on:{' '}
                <span className="font-[500]">{data.seller?.createdAt.toString().slice(0, 10)}</span>
              </h5>
              <h5 className="font-[600] pt-3">
                Total Products: <span className="font-[500]">{products && products.length}</span>
              </h5>
              <h5 className="font-[600] pt-3">
                Total Reviews: <span className="font-[500]">{totalReviewsLength}</span>
              </h5>
              <Link to="/">
                <div className={`${styles.button} !rounded-[4px] !h-[39.5px] mt-3`}>
                  <h4 className="text-white">Visit Shop</h4>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
