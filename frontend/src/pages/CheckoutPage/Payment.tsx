import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Strip
import {
  // StripeElementsOptions,
  loadStripe
} from '@stripe/stripe-js';
import {
  useStripe,
  useElements,
  Elements,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement
} from '@stripe/react-stripe-js';

// Paypal
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

import { toast } from 'react-toastify';
import { axiosInstance } from '../../server';
import CartData from './CartData';
import Button from '../../components/Button';
import styles from '../../styles/styles';
import { useAppSelector } from '../../redux/hook';
import { RxCross1 } from 'react-icons/rx';

const Payment = () => {
  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY!);

  // stripe payment
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState<any>({});
  // const [stripOptions, setStripOptions] = useState<StripeElementsOptions>({
  //   mode: 'payment',
  //   amount: 1,
  //   currency: 'usd',
  //   appearance: {}
  // });

  useEffect(() => {
    const getOrderData = JSON.parse(localStorage.getItem('latestOrder') || '');
    setOrderData(getOrderData);

    // setStripOptions((prev) => ({ ...prev, amount: parseFloat(getOrderData.totalPrice) }));
  }, [orderData.totalPrice]);

  const order: any = {
    cart: orderData?.cart,
    shippingAddress: orderData?.shippingAddress,
    user: orderData?.user,
    totalPrice: orderData?.totalPrice
  };

  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="w-[90%] 1000px:w-[70%] block 800px:flex">
        <div className="w-full 800px:w-[65%]">
          <div className="w-full 800px:w-[95%] bg-[#fff] rounded-md p-5 pb-8">
            {/* stripe Payment Handler */}
            <Elements stripe={stripePromise}>
              <StripePayment orderData={orderData} navigate={navigate} order={order} />
            </Elements>
          </div>

          <div className="w-full 800px:w-[95%] bg-[#fff] rounded-md p-5 pb-8">
            <PayPal orderData={orderData} navigate={navigate} order={order} />
          </div>

          <div className="w-full 800px:w-[95%] bg-[#fff] rounded-md p-5 pb-8">
            <COD navigate={navigate} order={order} />
          </div>
        </div>
        <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
          <CartData orderData={orderData} />
        </div>
      </div>
    </div>
  );
};

const StripePayment = ({ orderData, navigate, order }: any) => {
  const { user } = useAppSelector((state) => state.user);
  const stripe = useStripe();
  const elements = useElements();

  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const paymentData = {
    amount: Math.round(orderData?.totalPrice * 100)
  };

  const stripeCardOptions = {
    style: {
      base: {
        fontSize: '19px',
        lineHeight: '1.5',
        color: '#444'
      },
      empty: {
        color: '#3a120a',
        backgroundColor: 'transparent',
        '::placeholder': {
          color: '#444'
        }
      }
    }
  };

  const stripePaymentHandler = async (e: any) => {
    e.preventDefault();

    try {
      setLoading(true);
      if (!stripe || !elements) {
        setLoading(false);
        return;
      }

      // Trigger form validation and wallet collection
      const { error: submitError }: any = await elements.submit();
      if (submitError) {
        toast.error(submitError.message);
        console.log(submitError);
        setLoading(false);
        return;
      }

      const {
        data: { client_secret }
      } = await axiosInstance.post('/payment/process', paymentData);

      const { error, paymentIntent } = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement)!
        }
      });

      if (error) {
        console.log(error);
        toast.error(error.message);
        setLoading(false);
      } else {
        if (paymentIntent.status === 'succeeded') {
          order.paymentInfo = {
            id: paymentIntent.id,
            status: paymentIntent.status,
            type: 'Credit Card'
          };

          await axiosInstance.post(`/order/create-order`, order).then((res) => {
            setOpen(false);
            setLoading(false);
            navigate('/checkout/order/success');
            toast.success('Order successful!');
            localStorage.setItem('cartItems', JSON.stringify([]));
            localStorage.setItem('latestOrder', JSON.stringify([]));
            window.location.reload();
          });
        }
      }
    } catch (error: any) {
      console.log(error);
      setLoading(false);
      toast.error(error);
    }
  };

  return (
    <div>
      <div className="flex w-full pb-5 border-b mb-2">
        <div
          className="w-[25px] h-[25px] rounded-full bg-transparent border-[3px] border-[#1d1a1ab4] relative flex items-center justify-center"
          onClick={() => setOpen(() => !open)}>
          {open ? <div className="w-[13px] h-[13px] bg-[#1d1a1acb] rounded-full" /> : null}
        </div>
        <h4 className="text-[18px] pl-2 font-[600] text-[#000000b1]">Pay with Debit/credit card</h4>
      </div>

      {/* pay with card */}
      {open ? (
        <div className="w-full flex border-b">
          <form className="w-full" onSubmit={stripePaymentHandler}>
            <div className="w-full flex pb-3">
              <div className="w-[50%]">
                <label className="block pb-2">Name On Card</label>
                <input
                  required
                  placeholder={user?.name}
                  className={`${styles.input} !w-[95%] text-[#444]`}
                  value={user?.name}
                />
              </div>

              <div className="w-[50%]">
                <label className="block pb-2">Exp Date</label>
                <CardExpiryElement className={`${styles.input}`} options={stripeCardOptions} />
              </div>
            </div>

            <div className="w-full flex pb-3">
              <div className="w-[50%]">
                <label className="block pb-2">Card Number</label>
                <CardNumberElement
                  className={`${styles.input} !h-[35px] !w-[95%]`}
                  options={stripeCardOptions}
                />
              </div>
              <div className="w-[50%]">
                <label className="block pb-2">CVV</label>
                <CardCvcElement
                  className={`${styles.input} !h-[35px]`}
                  options={stripeCardOptions}
                />
              </div>
            </div>

            <Button
              type="submit"
              title="Pay"
              disabled={!stripe || !elements}
              loading={loading}
              wrapperStyle={{ marginTop: 30, marginBottom: 20 }}
            />
          </form>
        </div>
      ) : null}
    </div>
  );
};

const PayPal = ({ orderData, navigate, order }: any) => {
  const [open, setOpen] = useState<boolean>(false);
  const [payNow, setPayNow] = useState<boolean>(false);

  const createOrder = (data: any, actions: any) => {
    return actions.order
      .create({
        purchase_units: [
          {
            description: 'Sunflower',
            amount: {
              currency_code: 'USD',
              value: orderData?.totalPrice
            }
          }
        ],
        // not needed if a shipping address is actually needed
        application_context: {
          shipping_preference: 'NO_SHIPPING'
        }
      })
      .then((orderID: any) => {
        return orderID;
      });
  };

  const onApprove = async (data: any, actions: any) => {
    return actions.order.capture().then(function (details: any) {
      const { payer } = details;

      let paymentInfo = payer;

      if (paymentInfo !== undefined) {
        paypalPaymentHandler(paymentInfo);
      }
    });
  };

  const paypalPaymentHandler = async (paymentInfo: any) => {
    try {
      order.paymentInfo = {
        id: paymentInfo.payer_id,
        status: 'succeeded',
        type: 'Paypal'
      };

      await axiosInstance.post('/order/create-order', order).then((res) => {
        setOpen(false);
        navigate('/checkout/order/success');
        toast.success('Order successful!');
        localStorage.setItem('cartItems', JSON.stringify([]));
        localStorage.setItem('latestOrder', JSON.stringify([]));
        window.location.reload();
      });
    } catch (error) {
      navigate('/error');
      console.log(error);
    }
  };

  const initialOptions = {
    clientId: process.env.REACT_APP_PAYPAL_CLIENT_ID!,
    currency: 'USD',
    intent: 'capture'
  };

  return (
    <div className="w-full pb-5 border-b mb-2">
      <div className="flex">
        <div
          className="w-[25px] h-[25px] rounded-full bg-transparent border-[3px] border-[#1d1a1ab4] relative flex items-center justify-center"
          onClick={() => setOpen(() => !open)}>
          {open ? <div className="w-[13px] h-[13px] bg-[#1d1a1acb] rounded-full" /> : null}
        </div>
        <h4 className="text-[18px] pl-2 font-[600] text-[#000000b1]">Pay with Paypal</h4>
      </div>

      {open ? (
        <div
          className={`${styles.button} !bg-[#f63b60] text-white h-[45px] rounded-[5px] cursor-pointer text-[18px] font-[600]`}
          onClick={() => setPayNow(true)}>
          Pay Now
        </div>
      ) : null}

      {payNow && (
        <div className="w-full flex border-b">
          <div className="w-full fixed top-0 left-0 bg-[#00000039] h-screen flex items-center justify-center z-[99999]">
            <div className="w-full 800px:w-[40%] h-screen 800px:h-[80vh] bg-white rounded-[5px] shadow flex flex-col justify-center p-8 relative overflow-y-scroll">
              <div className="w-full flex justify-end p-3">
                <RxCross1
                  size={30}
                  className="cursor-pointer absolute top-3 right-3"
                  onClick={() => setPayNow(false)}
                />
              </div>
              <PayPalScriptProvider options={initialOptions}>
                <PayPalButtons
                  style={{ layout: 'vertical' }}
                  onApprove={onApprove}
                  createOrder={createOrder}
                />
              </PayPalScriptProvider>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const COD = ({ navigate, order }: any) => {
  const [open, setOpen] = useState<boolean>(false);

  const cashOnDeliveryHandler = async (e: any) => {
    e.preventDefault();

    order.paymentInfo = {
      type: 'Cash On Delivery'
    };

    await axiosInstance.post('/order/create-order', order).then((res) => {
      setOpen(false);
      navigate('/checkout/order/success');
      toast.success('Order successful!');
      localStorage.setItem('cartItems', JSON.stringify([]));
      localStorage.setItem('latestOrder', JSON.stringify([]));
      window.location.reload();
    });
  };

  return (
    <div>
      <div className="flex w-full pb-5 border-b mb-2">
        <div
          className="w-[25px] h-[25px] rounded-full bg-transparent border-[3px] border-[#1d1a1ab4] relative flex items-center justify-center"
          onClick={() => setOpen(true)}>
          {open ? <div className="w-[13px] h-[13px] bg-[#1d1a1acb] rounded-full" /> : null}
        </div>
        <h4 className="text-[18px] pl-2 font-[600] text-[#000000b1]">Cash on Delivery</h4>
      </div>

      {/* cash on delivery */}
      {open ? (
        <div className="w-full flex">
          <form className="w-full" onSubmit={cashOnDeliveryHandler}>
            <input
              type="submit"
              value="Confirm"
              className={`${styles.button} !bg-[#f63b60] text-[#fff] h-[45px] rounded-[5px] cursor-pointer text-[18px] font-[600]`}
            />
          </form>
        </div>
      ) : null}
    </div>
  );
};

export default Payment;
