import React, { useState } from 'react';
import { AiFillHeart, AiOutlineEye, AiOutlineHeart, AiOutlineShoppingCart } from 'react-icons/ai';
import { Link } from 'react-router-dom';

import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import styles from '../../styles/styles';
import Ratings from './Ratings';
import { addToCart } from '../../redux/reducers/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../redux/reducers/wishlistSlice';

const ProductCard = ({ data, isEvent }: any) => {
  const { wishlist } = useAppSelector((state) => state.wishlist);
  const { cart } = useAppSelector((state) => state.cart);

  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (wishlist?.find((wish: any) => wish?._id === data?._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist, data?._id]);

  const removeFromWishlistHandler = (data: any) => {
    setClick(!click);
    dispatch(removeFromWishlist(data));
  };

  const addToWishlistHandler = (data: any) => {
    setClick(!click);
    dispatch(addToWishlist(data));
  };

  const addToCartHandler = (id: string) => {
    const isItemExists = cart?.find(({ cartItem }: any) => cartItem?._id === id);

    if (isItemExists) toast.warn('Item already in cart!');
    else {
      if (data.stock < 1) {
        toast.error('Product stock limited!');
      } else {
        dispatch(addToCart(data));
        toast.success('Item added to cart successfully!');
      }
    }
  };

  return (
    <>
      <div className="w-full bg-white rounded-lg shadow-sm p-3 relative cursor-pointer">
        <div className="flex justify-end"></div>
        <Link
          to={`${
            isEvent === true ? `/product/${data?._id}?isEvent=true` : `/product/${data?._id}`
          }`}>
          <img src={`${data.images[0]}`} alt="" className="w-full h-[170px] object-contain" />
        </Link>
        <Link to={`/shop/preview/${data?.seller?._id}`}>
          <h5 className={`${styles.shop_name}`}>{data?.seller.shopName}</h5>
        </Link>
        <Link
          to={`${
            isEvent === true ? `/product/${data?._id}?isEvent=true` : `/product/${data?._id}`
          }`}>
          <h4 className="pb-3 font-[500]">
            {data?.name.length > 40 ? data?.name.slice(0, 40) + '...' : data?.name}
          </h4>

          <div className="flex">
            <Ratings rating={data?.ratings} />
          </div>

          <div className="py-2 flex items-center justify-between">
            <div className="flex">
              <h5 className={`${styles.productDiscountPrice}`}>
                {data.originalPrice === 0 ? data.originalPrice : data.discountPrice}$
              </h5>
              <h4 className={`${styles.price}`}>
                {data.originalPrice ? data.originalPrice + ' $' : null}
              </h4>
            </div>
            <span className="font-[400] text-[17px] text-[#68d284]">{data?.sold_out} sold</span>
          </div>
        </Link>

        {/* side options */}
        <div>
          {click ? (
            <AiFillHeart
              size={22}
              className="cursor-pointer absolute right-2 top-5"
              onClick={() => removeFromWishlistHandler(data)}
              color={click ? 'red' : '#333'}
              title="Remove from wishlist"
            />
          ) : (
            <AiOutlineHeart
              size={22}
              className="cursor-pointer absolute right-2 top-5"
              onClick={() => addToWishlistHandler(data)}
              color={click ? 'red' : '#333'}
              title="Add to wishlist"
            />
          )}

          <AiOutlineEye
            size={22}
            className="cursor-pointer absolute right-2 top-14"
            onClick={() => setOpen(!open)}
            color="#333"
            title="Quick view"
          />

          <AiOutlineShoppingCart
            size={25}
            className="cursor-pointer absolute right-2 top-24"
            onClick={() => addToCartHandler(data?._id)}
            color="#444"
            title="Add to cart hello"
          />
          {/* {open ? <ProductDetailsCard setOpen={setOpen} data={data} /> : null} */}
        </div>
      </div>
    </>
  );
};

export default ProductCard;
