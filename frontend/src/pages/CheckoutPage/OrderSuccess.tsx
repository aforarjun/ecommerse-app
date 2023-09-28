import Lottie from 'react-lottie';
import animationData from '../../assets/animation/success.json';
import Button from '../../components/Button';
import { Link } from 'react-router-dom';

const OrderSuccess = () => {
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };
  return (
    <div>
      <Lottie options={defaultOptions} width={300} height={300} />
      <h5 className="text-center mb-3 text-[25px] text-[#000000a1]">Your order is successful 😍</h5>
      <p className="text-center mb-14 text-cyan-500 hover:underline">
        <Link to="/">View order details</Link>
      </p>
    </div>
  );
};

export default OrderSuccess;
