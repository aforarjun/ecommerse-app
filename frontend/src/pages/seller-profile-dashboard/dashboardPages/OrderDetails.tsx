import React, { useEffect, useState } from 'react';
import { BsFillBagFill } from 'react-icons/bs';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import { axiosInstance } from '../../../server';
import styles from '../../../styles/styles';
import { getSellerOrders } from '../../../redux/reducers/ordersSlice';
import Loader from '../../../components/Loader';
import Button from '../../../components/Button';

const OrderDetails = () => {
  const { sellerOrders, isLoading } = useAppSelector((state) => state.order);
  const { seller } = useAppSelector((state) => state.seller);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    dispatch(getSellerOrders(seller!._id));
  }, [seller, dispatch]);

  const data: any = sellerOrders?.find((item: any) => item._id === id);
  const [status, setStatus] = useState<string>(data?.status);
  const [isStatusUpdate, setIsStatusUpdate] = useState(false);

  const orderUpdateHandler = async (e: any) => {
    setIsStatusUpdate(true);

    await axiosInstance
      .put(
        `/order/update-order-status/${id}`,
        {
          status
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success('Order updated!');
        navigate('/seller/dashboard');
        setIsStatusUpdate(false);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        setIsStatusUpdate(false);
      });
  };

  const refundOrderUpdateHandler = async (e: any) => {
    setIsStatusUpdate(true);
    await axiosInstance
      .put(
        `/order/approve-order-refund/${id}`,
        {
          status
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success('Order updated!');
        dispatch(getSellerOrders(seller!._id));
        setIsStatusUpdate(false);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        setIsStatusUpdate(false);
      });
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className={`px-4 py-4 h-[100%] ${styles.section}`}>
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center">
              <BsFillBagFill size={30} color="crimson" />
              <h1 className="pl-2 text-[25px]">Order Details</h1>
            </div>
            <Link to="/seller/dashboard/all-orders">
              <Button
                title="Order List"
                className={`${styles.button} !bg-[#fce1e6] !rounded-[4px] text-[#e94560] font-[600] !h-[45px] text-[18px]`}
              />
            </Link>
          </div>

          <div className="w-full flex items-center justify-between pt-6">
            <h5 className="text-[#00000084]">
              Order ID: <span>#{data?._id?.slice(0, 8)}</span>
            </h5>
            <h5 className="text-[#00000084]">
              Placed on: <span>{data?.createdAt?.slice(0, 10)}</span>
            </h5>
          </div>

          {/* order items */}
          {data?.cart.map(({ cartItem, qty }: any, index: number) => (
            <div className="w-full flex items-start mb-5">
              <img src={`${cartItem.images[0]}`} alt="" className="w-[80x] h-[80px]" />
              <div className="w-full">
                <h5 className="pl-3 text-[20px]">{cartItem.name}</h5>
                <h5 className="pl-3 text-[20px] text-[#00000091]">
                  US${cartItem.discountPrice} x {qty}
                </h5>
              </div>
            </div>
          ))}

          <div className="border-t w-full text-right">
            <h5 className="pt-3 text-[18px]">
              Total Price: <strong>US${data?.totalPrice}</strong>
            </h5>
          </div>

          <div className="w-full 800px:flex items-center">
            <div className="w-full 800px:w-[60%]">
              <h4 className="pt-3 text-[20px] font-[600]">Shipping Address:</h4>
              <h4 className="text-[16px] font-[400]">{data?.shippingAddress.address.address1}</h4>
              <h4 className="text-[16px]">{data?.shippingAddress.address.address2}</h4>
              <h4 className=" text-[16px]">
                {data?.shippingAddress.address.city}, {data?.shippingAddress.address.country}
              </h4>
              <h4 className=" text-[16px]">{data?.user?.phoneNumber}</h4>
            </div>

            <div className="w-full 800px:w-[40%]">
              <h4 className="pt-3 text-[20px]">Payment Info:</h4>
              <h4>Status: {data?.status ? data?.status : 'Not Paid'}</h4>
            </div>
          </div>

          <h4 className="pt-3 text-[20px] font-[600]">Order Status:</h4>
          {data?.status !== 'Processing refund' && data?.status !== 'Refund Success' && (
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-[200px] mt-2 border h-[35px] rounded-[5px]">
              {[
                'Processing',
                'Transferred to delivery partner',
                'Shipping',
                'Received',
                'On the way',
                'Delivered'
              ]
                .slice(
                  [
                    'Processing',
                    'Transferred to delivery partner',
                    'Shipping',
                    'Received',
                    'On the way',
                    'Delivered'
                  ].indexOf(data?.status)
                )
                .map((option, index) => (
                  <option value={option} key={index}>
                    {option}
                  </option>
                ))}
            </select>
          )}
          {data?.status === 'Processing refund' || data?.status === 'Refund Success' ? (
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-[200px] mt-2 border h-[35px] rounded-[5px]">
              {['Processing refund', 'Refund Success']
                .slice(['Processing refund', 'Refund Success'].indexOf(data?.status))
                .map((option, index) => (
                  <option value={option} key={index}>
                    {option}
                  </option>
                ))}
            </select>
          ) : null}

          <Button
            title="Update Status"
            disabled={isStatusUpdate}
            loading={isStatusUpdate}
            wrapperStyle={{ marginTop: 20 }}
            onClick={
              data?.status !== 'Processing refund' ? orderUpdateHandler : refundOrderUpdateHandler
            }
          />
        </div>
      )}
    </>
  );
};

export default OrderDetails;
