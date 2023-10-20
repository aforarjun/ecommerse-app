import React, { useEffect, useState } from 'react';
import { RxCross1 } from 'react-icons/rx';
import { IoBagHandleOutline } from 'react-icons/io5';
import { HiOutlineMinus, HiPlus } from 'react-icons/hi';
import styles from '../../styles/styles';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { addToCart, deleteFromCart, removeFromCart } from '../../redux/reducers/cartSlice';
import { Product } from '../../utils/Interfaces';

const Cart = ({ setOpenCart }: any) => {
  const { cart } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    setTotalPrice(
      () =>
        cart?.reduce((acc: number, { cartItem, qty }: any) => acc + qty * cartItem.discountPrice, 0)
    );
  }, [cart, dispatch]);

  return (
    <div className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-10">
      <div className="fixed top-0 right-0 h-full w-[80%] 800px:w-[400px] bg-white flex flex-col overflow-y-scroll justify-between shadow-sm">
        {cart?.length === 0 ? (
          <div className="w-full h-screen flex items-center justify-center">
            <div className="flex w-full justify-end pt-5 pr-5 fixed top-3 right-3">
              <RxCross1 size={25} className="cursor-pointer" onClick={() => setOpenCart(false)} />
            </div>
            <h5>Cart Items is empty!</h5>
          </div>
        ) : (
          <>
            <div>
              <div className="flex w-full justify-end pt-5 pr-5">
                <RxCross1 size={25} className="cursor-pointer" onClick={() => setOpenCart(false)} />
              </div>
              {/* Item length */}
              <div className={`${styles.noramlFlex} p-4`}>
                <IoBagHandleOutline size={25} />
                <h5 className="pl-2 text-[20px] font-[500]">
                  {cart?.reduce((accumulator, item) => accumulator + item.qty, 0)} items
                </h5>
              </div>

              {/* cart Single Items */}
              <br />
              <div className="w-full border-t">
                {cart &&
                  cart.map((item, index) => (
                    <CartSingle key={index} data={item} dispatch={dispatch} />
                  ))}
              </div>
            </div>

            <div className="px-5 mb-3">
              {/* checkout buttons */}
              <Link to="/checkout">
                <div
                  className={`h-[45px] flex items-center justify-center w-[100%] bg-[#e44343] rounded-[5px]`}>
                  <h1 className="text-[#fff] text-[18px] font-[600]">
                    Checkout Now (USD${totalPrice})
                  </h1>
                </div>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const CartSingle = ({ data, dispatch }: any) => {
  const { cartItem, qty } = data;
  const totalPrice = cartItem.discountPrice * qty;

  const increment = (cartData: Product) => {
    if (cartData.stock < qty) {
      toast.error('Product stock limited!');
    } else {
      dispatch(addToCart(cartData));
    }
  };

  const decrement = (cartData: Product) => {
    dispatch(removeFromCart(cartData));
  };

  return (
    <div className="border-b p-4">
      <div className="w-full flex items-center">
        <div>
          <div
            className={`bg-[#e44343] border border-[#e4434373] rounded-full w-[25px] h-[25px] ${styles.noramlFlex} justify-center cursor-pointer`}
            onClick={() => increment(cartItem)}>
            <HiPlus size={18} color="#fff" />
          </div>
          <span className="pl-[10px]">{qty}</span>
          <div
            className="bg-[#a7abb14f] rounded-full w-[25px] h-[25px] flex items-center justify-center cursor-pointer"
            onClick={() => decrement(cartItem)}>
            <HiOutlineMinus size={16} color="#7d879c" />
          </div>
        </div>
        <img
          src={`${cartItem?.images[0]}`}
          alt=""
          className="w-[130px] h-min ml-2 mr-2 rounded-[5px]"
        />
        <div className="pl-[5px] flex-1">
          <h1 className="text-sm">{cartItem.name}</h1>
          <h4 className="font-[400] text-[15px] text-[#00000082]">
            ${cartItem.discountPrice} * {qty}
          </h4>
          <h4 className="font-[600] text-[17px] pt-[3px] text-[#d02222] font-Roboto">
            US${totalPrice}
          </h4>
        </div>
        <RxCross1
          className="cursor-pointer"
          onClick={() => dispatch(deleteFromCart(cartItem._id))}
        />
      </div>
    </div>
  );
};

export default Cart;
