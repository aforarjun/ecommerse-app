import React from 'react';
import { Route, Routes } from 'react-router-dom';
import DashboardHeader from './DashboardHeader';
import DashboardSideBar from './DashboardSideBar';
import DashboardHero from '../dashboardPages/DashboardHero';
import AllOrders from '../dashboardPages/AllOrders';
import AllProducts from '../dashboardPages/AllProducts';
import CreateProduct from '../dashboardPages/CreateProduct';
import AllEvents from '../dashboardPages/AllEvents';
import CreateEvent from '../dashboardPages/CreateEvent';
import AllCoupons from '../dashboardPages/AllCoupons';
import AllRefundOrders from '../dashboardPages/AllRefundOrders';
import OrderDetails from '../dashboardPages/OrderDetails';
import WithdrawMoney from '../dashboardPages/WithdrawMoney';
import SellerSettings from '../dashboardPages/settings/SellerSettings';
import ErrorPage from '../../ErrorPage';

const ShopDashBoard = () => {
  return (
    <div>
      <DashboardHeader />

      <div className="flex items-start justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <DashboardSideBar />
        </div>

        <Routes>
          <Route path="/" element={<DashboardHero />} />
          <Route path="/all-orders" element={<AllOrders />} />
          <Route path="/order/:id" element={<OrderDetails />} />

          <Route path="/products" element={<AllProducts />} />
          <Route path="/create-product" element={<CreateProduct />} />
          <Route path="/events" element={<AllEvents />} />
          <Route path="/create-event" element={<CreateEvent />} />

          <Route path="/cupouns" element={<AllCoupons />} />
          <Route path="/refunds" element={<AllRefundOrders />} />

          <Route path="/withdraw-money" element={<WithdrawMoney />} />

          <Route path="/settings" element={<SellerSettings />} />

          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default ShopDashBoard;
