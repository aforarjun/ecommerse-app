import { useLottie } from 'lottie-react';
import animationData from '../assets/animation/animation.json';

const Loader = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };
  const { View } = useLottie(defaultOptions);

  return <div className="w-full h-screen flex items-center justify-center">{View}</div>;
};

export default Loader;
