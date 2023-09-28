import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Strip
import { StripeElementsOptions, loadStripe } from '@stripe/stripe-js';
import {
  CardNumberElement,
  useStripe,
  useElements,
  Elements,
  PaymentElement
} from '@stripe/react-stripe-js';

// import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from 'react-toastify';
import { axiosInstance } from '../../server';
import CartData from './CartData';
import Button from '../../components/Button';

const Payment = () => {
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState<any>([]);

  const stripePromise = loadStripe(`${process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}`);
  const [stripOptions, setStripOptions] = useState<StripeElementsOptions>();

  useEffect(() => {
    const getOrderData = JSON.parse(localStorage.getItem('latestOrder') || '');
    setOrderData(getOrderData);

    setStripOptions({
      mode: 'payment',
      amount: parseFloat(orderData?.totalPrice) || 1,
      currency: 'usd',
      appearance: {}
    });
  }, []);

  // const createOrder = (data: any, actions: any) => {
  //   return actions.order
  //     .create({
  //       purchase_units: [
  //         {
  //           description: 'Sunflower',
  //           amount: {
  //             currency_code: 'USD',
  //             value: orderData?.totalPrice
  //           }
  //         }
  //       ],
  //       // not needed if a shipping address is actually needed
  //       application_context: {
  //         shipping_preference: 'NO_SHIPPING'
  //       }
  //     })
  //     .then((orderID: any) => {
  //       return orderID;
  //     });
  // };

  // const onApprove = async (data: any, actions: any) => {
  //   return actions.order.capture().then(function (details: any) {
  //     const { payer } = details;

  //     let paymentInfo = payer;

  //     if (paymentInfo !== undefined) {
  //       paypalPaymentHandler(paymentInfo);
  //     }
  //   });
  // };

  // const paypalPaymentHandler = async (paymentInfo: any) => {
  //   const config = {
  //     headers: {
  //       'Content-Type': 'application/json'
  //     }
  //   };

  //   order.paymentInfo = {
  //     id: paymentInfo.payer_id,
  //     status: 'succeeded',
  //     type: 'Paypal'
  //   };

  //   await axiosInstance.post(`/order/create-order`, order, config).then((res: any) => {
  //     setOpen(false);
  //     navigate('/order/success');
  //     toast.success('Order successful!');
  //     localStorage.setItem('cartItems', JSON.stringify([]));
  //     localStorage.setItem('latestOrder', JSON.stringify([]));
  //     window.location.reload();
  //   });
  // };

  // const cashOnDeliveryHandler = async (e: any) => {
  //   e.preventDefault();

  //   const config = {
  //     headers: {
  //       'Content-Type': 'application/json'
  //     }
  //   };

  //   order.paymentInfo = {
  //     type: 'Cash On Delivery'
  //   };

  //   await axiosInstance.post(`/order/create-order`, order, config).then((res) => {
  //     setOpen(false);
  //     navigate('/order/success');
  //     toast.success('Order successful!');
  //     localStorage.setItem('cartItems', JSON.stringify([]));
  //     localStorage.setItem('latestOrder', JSON.stringify([]));
  //     window.location.reload();
  //   });
  // };
  console.log(orderData);
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
            <Elements stripe={stripePromise} options={stripOptions}>
              <StripePayment orderData={orderData} navigate={navigate} order={order} />
            </Elements>
          </div>
        </div>
        <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
          <CartData orderData={orderData} />
        </div>
      </div>
    </div>
  );
};

// const PaymentInfo = ({
//   user,
//   open,
//   setOpen,
//   onApprove,
//   createOrder,
//   stripePaymentHandler,
//   cashOnDeliveryHandler
// }: any) => {
//   const [select, setSelect] = useState(1);

//   return (
//     <div className="w-full 800px:w-[95%] bg-[#fff] rounded-md p-5 pb-8">
//       {/* stripe Payment Handler */}
//       <StripePayment user={user} stripePaymentHandler={stripePaymentHandler} />

//       <br />
//       {/* paypal payment */}
//       <div>
//         <div className="flex w-full pb-5 border-b mb-2">
//           <div
//             className="w-[25px] h-[25px] rounded-full bg-transparent border-[3px] border-[#1d1a1ab4] relative flex items-center justify-center"
//             onClick={() => setSelect(2)}>
//             {select === 2 ? (
//               <div className="w-[13px] h-[13px] bg-[#1d1a1acb] rounded-full" />
//             ) : null}
//           </div>
//           <h4 className="text-[18px] pl-2 font-[600] text-[#000000b1]">Pay with Paypal</h4>
//         </div>

//         {/* pay with payement */}
//         {select === 2 ? (
//           <div className="w-full flex border-b">
//             <div
//               className={`${styles.button} !bg-[#f63b60] text-white h-[45px] rounded-[5px] cursor-pointer text-[18px] font-[600]`}
//               onClick={() => setOpen(true)}>
//               Pay Now
//             </div>
//             {open && (
//               <div className="w-full fixed top-0 left-0 bg-[#00000039] h-screen flex items-center justify-center z-[99999]">
//                 <div className="w-full 800px:w-[40%] h-screen 800px:h-[80vh] bg-white rounded-[5px] shadow flex flex-col justify-center p-8 relative overflow-y-scroll">
//                   <div className="w-full flex justify-end p-3">
//                     <RxCross1
//                       size={30}
//                       className="cursor-pointer absolute top-3 right-3"
//                       onClick={() => setOpen(false)}
//                     />
//                   </div>
//                   {/* <PayPalScriptProvider
//                                         options={{
//                                             "client-id":
//                                                 "Aczac4Ry9_QA1t4c7TKH9UusH3RTe6onyICPoCToHG10kjlNdI-qwobbW9JAHzaRQwFMn2-k660853jn",
//                                         }}
//                                     >
//                                         <PayPalButtons
//                                             style={{ layout: "vertical" }}
//                                             onApprove={onApprove}
//                                             createOrder={createOrder}
//                                         />
//                                     </PayPalScriptProvider> */}
//                 </div>
//               </div>
//             )}
//           </div>
//         ) : null}
//       </div>

//       <br />
//       {/* cash on delivery */}
//       <div>
//         <div className="flex w-full pb-5 border-b mb-2">
//           <div
//             className="w-[25px] h-[25px] rounded-full bg-transparent border-[3px] border-[#1d1a1ab4] relative flex items-center justify-center"
//             onClick={() => setSelect(3)}>
//             {select === 3 ? (
//               <div className="w-[13px] h-[13px] bg-[#1d1a1acb] rounded-full" />
//             ) : null}
//           </div>
//           <h4 className="text-[18px] pl-2 font-[600] text-[#000000b1]">Cash on Delivery</h4>
//         </div>

//         {/* cash on delivery */}
//         {select === 3 ? (
//           <div className="w-full flex">
//             <form className="w-full" onSubmit={cashOnDeliveryHandler}>
//               <input
//                 type="submit"
//                 value="Confirm"
//                 className={`${styles.button} !bg-[#f63b60] text-[#fff] h-[45px] rounded-[5px] cursor-pointer text-[18px] font-[600]`}
//               />
//             </form>
//           </div>
//         ) : null}
//       </div>
//     </div>
//   );
// };

const StripePayment = ({ orderData, navigate, order }: any) => {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState(null);
  const [open, setOpen] = useState(false);

  const paymentData = {
    amount: Math.round(orderData?.totalPrice * 100)
  };

  const stripePaymentHandler = async (e: any) => {
    e.preventDefault();

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      if (!stripe || !elements) return;

      // Trigger form validation and wallet collection
      const { error: submitError }: any = await elements.submit();
      if (submitError) {
        setErrorMessage(submitError.message);
        return;
      }

      const res: any = await axiosInstance.post(`/payment/process`, paymentData, config);
      const { client_secret: clientSecret } = await res.json();

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement)!
        }
      });

      if (error) {
        toast.error(error.message);
      } else {
        if (paymentIntent.status === 'succeeded') {
          order.paymnentInfo = {
            id: paymentIntent.id,
            status: paymentIntent.status,
            type: 'Credit Card'
          };

          await axiosInstance.post(`/order/create-order`, order, config).then((res) => {
            setOpen(false);
            navigate('/order/success');
            toast.success('Order successful!');
            localStorage.setItem('cartItems', JSON.stringify([]));
            localStorage.setItem('latestOrder', JSON.stringify([]));
            window.location.reload();
          });
        }
      }
    } catch (error: any) {
      toast.error(error);
    }
  };

  return (
    <div>
      <div className="flex w-full pb-5 border-b mb-2">
        <div
          className="w-[25px] h-[25px] rounded-full bg-transparent border-[3px] border-[#1d1a1ab4] relative flex items-center justify-center"
          onClick={() => setOpen(true)}>
          {open ? <div className="w-[13px] h-[13px] bg-[#1d1a1acb] rounded-full" /> : null}
        </div>
        <h4 className="text-[18px] pl-2 font-[600] text-[#000000b1]">Pay with Debit/credit card</h4>
      </div>

      {/* pay with card */}
      {open ? (
        <div className="w-full flex border-b">
          <form className="w-full" onSubmit={stripePaymentHandler}>
            <PaymentElement />
            <Button
              type="submit"
              title="Pay"
              disabled={!stripe || !elements}
              wrapperStyle={{ marginTop: 30 }}
            />
            {errorMessage && <div>{errorMessage}</div>}
          </form>
        </div>
      ) : null}
    </div>
  );
};

export default Payment;
