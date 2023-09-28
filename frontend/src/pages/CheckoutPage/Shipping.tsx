import { useState } from 'react';
import styles from '../../styles/styles';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppSelector } from '../../redux/hook';
import { axiosInstance } from '../../server';

import Button from '../../components/Button';
import { AiOutlineBars } from 'react-icons/ai';

const Shipping = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.user);
  const { cart } = useAppSelector((state) => state.cart);

  //   shipping address
  const [name, setName] = useState<string>(user?.name || '');
  const [email, setEmail] = useState<string>(user?.email || '');
  const [phoneNumber, setPhoneNumber] = useState<number>(Number(user?.phoneNumber));
  const [address, setAddress] = useState<any>({});

  const [couponCode, setCouponCode] = useState<string>('');
  const [couponCodeData, setCouponCodeData] = useState<any>(null);
  const [discountPrice, setDiscountPrice] = useState<any>(null);

  const [showAppliedCoupon, setShowAppliedCoupon] = useState<string>('');
  const subTotalPrice: number = cart.reduce(
    (acc: number, { cartItem, qty }: any) => acc + qty * cartItem.discountPrice,
    0
  );

  // this is shipping cost variable
  const shippingCost: number = subTotalPrice * 0.05;

  const couponCodeApply = (e: any) => {
    e.preventDefault();
    const name = couponCode;

    axiosInstance
      .get(`/coupon/get-coupon-code/${name}`, { withCredentials: true })
      .then(({ data: { couponCode } }: any) => {
        if (!couponCode) {
          toast.error('Invalid Coupon code!');
          return;
        }

        const sellerId = couponCode.sellerId;
        const discountPercentenge = couponCode.value;

        const isCouponValid = cart?.filter(({ cartItem }: any) => cartItem.sellerId === sellerId);

        if (isCouponValid.length === 0) {
          toast.error('Coupon code is not valid for this shop');
          setCouponCode('');
        } else {
          const eligiblePrice = isCouponValid.reduce(
            (acc: number, { qty, cartItem }: any) => acc + qty * cartItem.discountPrice,
            0
          );
          const discountPrice = (eligiblePrice * discountPercentenge) / 100;
          setDiscountPrice(discountPrice);
          setCouponCodeData(couponCode);
          setShowAppliedCoupon(couponCode.name);
          setCouponCode('');
        }
      })
      .catch((err) => {
        // toast.error(err.response.data);
        console.log(err);
      });
  };

  const discountPercentenge = couponCodeData ? discountPrice : '';

  const totalPrice = couponCodeData
    ? (subTotalPrice + shippingCost - discountPercentenge).toFixed(2)
    : (subTotalPrice + shippingCost).toFixed(2);

  const paymentSubmit = () => {
    if (!name || !email || !phoneNumber || !address?.addressType) {
      toast.error('Enter shipping address all fields');
      return;
    }

    const shippingAddress = { name, email, phoneNumber, address };

    const orderData = {
      cart,
      totalPrice,
      subTotalPrice,
      shipping: shippingCost,
      discount: {
        name: showAppliedCoupon,
        price: discountPrice
      },
      shippingAddress,
      user
    };

    // update local storage with the updated orders array
    localStorage.setItem('latestOrder', JSON.stringify(orderData));
    navigate('/checkout/payment');
  };

  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="w-[90%] 1000px:w-[70%] block 800px:flex">
        <div className="w-full 800px:w-[65%]">
          <ShippingInfo
            user={user}
            setName={setName}
            setEmail={setEmail}
            setPhoneNumber={setPhoneNumber}
            address={address}
            setAddress={setAddress}
            paymentSubmit={paymentSubmit}
          />
        </div>
        <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
          <CartData
            handleSubmit={couponCodeApply}
            totalPrice={totalPrice}
            shipping={shippingCost}
            subTotalPrice={subTotalPrice}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            discountPercentenge={discountPercentenge}
            showAppliedCoupon={showAppliedCoupon}
          />
        </div>
      </div>
    </div>
  );
};

const ShippingInfo = ({
  user,
  setName,
  setEmail,
  setPhoneNumber,
  address,
  setAddress,
  paymentSubmit
}: any) => {
  return (
    <div className="w-full 800px:w-[95%] bg-white rounded-md p-5 pb-8">
      <h5 className="text-[18px] font-[500]">Shipping Address</h5>
      <br />
      <div>
        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block pb-2">Full Name</label>
            <input
              type="text"
              value={user && user.name}
              className={`${styles.input} !w-[95%]`}
              onChange={(e: any) => setName(e.target.value)}
              required
            />
          </div>
          <div className="w-[50%]">
            <label className="block pb-2">Email Address</label>
            <input
              type="email"
              value={user && user.email}
              required
              className={`${styles.input}`}
              onChange={(e: any) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block pb-2">Phone Number</label>
            <input
              type="number"
              required
              value={user && user.phoneNumber}
              className={`${styles.input} !w-[95%]`}
              onChange={(e: any) => setPhoneNumber(e.target.value)}
            />
          </div>
        </div>

        <h5 className="text-[18px] cursor-pointer flex items-center gap-2">
          <AiOutlineBars size={22} />
          Choose From saved address
        </h5>

        <div>
          {user?.addresses.map((item: any) => (
            <div key={item._id} className="w-full flex mt-1">
              <input
                name="shippingAddress"
                type="radio"
                className="mr-3"
                value={JSON.stringify(item)}
                defaultChecked={item.addressType === address?.addressType ? true : false}
                onChange={(e: any) => {
                  if (e.target.checked) {
                    setAddress(JSON.parse(e.target.value));
                  } else {
                    setAddress({});
                  }
                }}
              />
              <h2>{item.addressType}</h2>
            </div>
          ))}
        </div>

        <Button
          title="Go to Payment"
          className={`${styles.button} text-white w-[150px] 800px:w-[280px] mt-10`}
          onClick={paymentSubmit}
        />
      </div>
    </div>
  );
};

const CartData = ({
  handleSubmit,
  totalPrice,
  shipping,
  subTotalPrice,
  couponCode,
  setCouponCode,
  discountPercentenge,

  showAppliedCoupon
}: any) => {
  return (
    <div className="w-full bg-[#fff] rounded-md p-5 pb-8">
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">subtotal:</h3>
        <h5 className="text-[18px] font-[600]">${subTotalPrice.toFixed(2)}</h5>
      </div>
      <br />
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">shipping:</h3>
        <h5 className="text-[18px] font-[600]">${shipping.toFixed(2)}</h5>
      </div>
      <br />
      <div className="flex justify-between border-b pb-3">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">Discount:</h3>
        <h5 className="text-[18px] font-[600] flex flex-col">
          <span className="text-[12px] font-bold">{showAppliedCoupon}</span>
          <span>- {discountPercentenge ? '$' + discountPercentenge.toString() : null}</span>
        </h5>
      </div>
      <h5 className="text-[18px] font-[600] text-end pt-3">${totalPrice}</h5>
      <br />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className={`${styles.input} h-[40px] pl-2`}
          placeholder="Coupoun code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          required
        />

        <input
          className={`w-full h-[40px] border border-[#f63b60] text-center text-[#f63b60] rounded-[3px] mt-8 cursor-pointer`}
          required
          value="Apply code"
          type="submit"
        />
      </form>
    </div>
  );
};

export default Shipping;
