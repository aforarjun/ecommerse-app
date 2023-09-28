import React from 'react';
import { AiOutlineGift } from 'react-icons/ai';
import { MdOutlineLocalOffer } from 'react-icons/md';
import { FiPackage, FiShoppingBag } from 'react-icons/fi';
import { BiMessageSquareDetail } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../redux/hook';

const DashboardHeader = () => {
  const { seller } = useAppSelector((state) => state.seller);

  return (
    <div className="w-full h-[80px] bg-white shadow sticky top-0 left-0 z-30 flex items-center justify-between px-4">
      <div>
        <Link to="/">
          <img src="https://shopo.quomodothemes.website/assets/images/logo.svg" alt="" />
        </Link>
      </div>
      <div className="flex items-center">
        <div className="flex items-center mr-4">
          <Link to="/seller/dashboard/cupouns" className="800px:block hidden">
            <AiOutlineGift color="#555" size={30} className="mx-5 cursor-pointer" />
          </Link>
          <Link to="/seller/dashboard/events" className="800px:block hidden">
            <MdOutlineLocalOffer color="#555" size={30} className="mx-5 cursor-pointer" />
          </Link>
          <Link to="/seller/dashboard/products" className="800px:block hidden">
            <FiShoppingBag color="#555" size={30} className="mx-5 cursor-pointer" />
          </Link>
          <Link to="/seller/dashboard/all-orders" className="800px:block hidden">
            <FiPackage color="#555" size={30} className="mx-5 cursor-pointer" />
          </Link>
          <Link to="/seller/dashboard/messages" className="800px:block hidden">
            <BiMessageSquareDetail color="#555" size={30} className="mx-5 cursor-pointer" />
          </Link>

          <Link to={`/seller/${seller?._id}`}>
            <img
              src={`${seller?.avatar}`}
              alt=""
              className="w-[50px] h-[50px] rounded-full object-cover"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
