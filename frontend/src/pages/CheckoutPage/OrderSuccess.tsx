import { useState, useEffect } from 'react';
import Lottie from 'react-lottie';
import animationData from '../../assets/animation/success.json';

const OrderSuccess = () => {
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  const [lastOrder, setLastOrder] = useState<any>({});

  useEffect(() => {
    const getLastOrder = JSON.parse(localStorage.getItem('latestOrder') || '');
    setLastOrder(getLastOrder);
  }, []);

  console.log(lastOrder);

  return (
    <div>
      <Lottie options={defaultOptions} width={300} height={300} />
      <h5 className="text-center mb-3 text-[25px] text-[#000000a1]">Your order is successful 😍</h5>
    </div>
  );
};

export default OrderSuccess;
