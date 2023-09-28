import { useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Footer from '../../components/footer/Footer';
import Header from '../../components/header/Header';

import CheckoutSteps from './CheckoutSteps';
import Shipping from './Shipping';
import Payment from './Payment';
import OrderSuccess from './OrderSuccess';
import ErrorPage from '../ErrorPage';

const CheckoutPage = () => {
  const { pathname } = useLocation();
  const [active, setActive] = useState<number>(1);

  switch (pathname) {
    case '/checkout':
      active > 1 && setActive(1);
      break;
    case '/checkout/payment':
      active !== 2 && setActive(2);
      break;
    case '/checkout/order/success':
      active !== 3 && setActive(3);
      break;
    default:
      break;
  }

  return (
    <div>
      <Header />
      <br />
      <br />
      <CheckoutSteps active={active} />

      <Routes>
        <Route path="/" element={<Shipping />} />
        <Route path="/payment" element={<Payment />} />

        <Route path="/order/success" element={<OrderSuccess />} />

        <Route path="*" element={<ErrorPage />} />
      </Routes>
      <br />
      <br />
      <Footer />
    </div>
  );
};

export default CheckoutPage;
