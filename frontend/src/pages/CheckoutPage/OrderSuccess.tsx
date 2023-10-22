import { useLottie } from 'lottie-react';
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
  const { View } = useLottie(defaultOptions);

  return (
    <div>
      {View}
      <h5 className="text-center mb-3 text-[25px] text-[#000000a1]">Your order is successful 😍</h5>
    </div>
  );
};

export default OrderSuccess;
