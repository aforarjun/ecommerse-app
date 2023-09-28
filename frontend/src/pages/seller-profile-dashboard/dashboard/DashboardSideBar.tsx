import React, { useEffect, useState } from 'react';
import { AiOutlineFolderAdd, AiOutlineGift } from 'react-icons/ai';
import { FiPackage, FiShoppingBag } from 'react-icons/fi';
import { MdOutlineLocalOffer } from 'react-icons/md';
import { RxDashboard } from 'react-icons/rx';
import { VscNewFile } from 'react-icons/vsc';
import { CiMoneyBill, CiSettings } from 'react-icons/ci';
import { BiMessageSquareDetail } from 'react-icons/bi';
import { Link, useLocation } from 'react-router-dom';
import { HiOutlineReceiptRefund } from 'react-icons/hi';

const DashboardSideBar = () => {
  const { pathname } = useLocation();
  const [active, setActive] = useState(1);

  useEffect(() => {
    switch (pathname) {
      case '/seller/dashboard/':
        setActive(1);
        break;
      case '/seller/dashboard':
        setActive(1);
        break;
      case '/seller/dashboard/all-orders':
        setActive(2);
        break;
      case '/seller/dashboard/products':
        setActive(3);
        break;
      case '/seller/dashboard/create-product':
        setActive(4);
        break;
      case '/seller/dashboard/events':
        setActive(5);
        break;
      case '/seller/dashboard/create-event':
        setActive(6);
        break;
    }
  });

  const dashboardSideTabs = [
    {
      id: '1',
      link: '/seller/dashboard/',
      activeTab: 1,
      icon: <RxDashboard size={30} color={`${active === 1 ? 'crimson' : '#555'}`} />,
      name: 'Dashboard'
    },
    {
      id: '2',
      link: '/seller/dashboard/all-orders',
      activeTab: 2,
      icon: <FiShoppingBag size={30} color={`${active === 2 ? 'crimson' : '#555'}`} />,
      name: 'All Orders'
    },
    {
      id: '3',
      link: '/seller/dashboard/products',
      activeTab: 3,
      icon: <FiPackage size={30} color={`${active === 3 ? 'crimson' : '#555'}`} />,
      name: 'All Products'
    },
    {
      id: '4',
      link: '/seller/dashboard/create-product',
      activeTab: 4,
      icon: <AiOutlineFolderAdd size={30} color={`${active === 4 ? 'crimson' : '#555'}`} />,
      name: 'Create Product'
    },
    {
      id: '5',
      link: '/seller/dashboard/events',
      activeTab: 5,
      icon: <MdOutlineLocalOffer size={30} color={`${active === 5 ? 'crimson' : '#555'}`} />,
      name: 'All Events'
    },
    {
      id: '6',
      link: '/seller/dashboard/create-event',
      activeTab: 6,
      icon: <VscNewFile size={30} color={`${active === 6 ? 'crimson' : '#555'}`} />,
      name: 'Create Event'
    },
    {
      id: '7',
      link: '/seller/dashboard/withdraw-money',
      activeTab: 7,
      icon: <CiMoneyBill size={30} color={`${active === 7 ? 'crimson' : '#555'}`} />,
      name: 'Withdraw Money'
    },
    {
      id: '8',
      link: '/seller/dashboard/messages',
      activeTab: 8,
      icon: <BiMessageSquareDetail size={30} color={`${active === 8 ? 'crimson' : '#555'}`} />,
      name: 'Shop Inbox'
    },
    {
      id: '9',
      link: '/seller/dashboard/cupouns',
      activeTab: 9,
      icon: <AiOutlineGift size={30} color={`${active === 9 ? 'crimson' : '#555'}`} />,
      name: 'Discount Codes'
    },
    {
      id: '10',
      link: '/seller/dashboard/refunds',
      activeTab: 10,
      icon: <HiOutlineReceiptRefund size={30} color={`${active === 10 ? 'crimson' : '#555'}`} />,
      name: 'Refunds'
    },
    {
      id: '11',
      link: '/seller/dashboard/settings',
      activeTab: 11,
      icon: <CiSettings size={30} color={`${active === 11 ? 'crimson' : '#555'}`} />,
      name: 'Settings'
    }
  ];

  return (
    <div className="w-full h-[90vh] bg-white shadow-sm overflow-y-scroll sticky top-0 left-0 z-10">
      {dashboardSideTabs.map(({ id, name, link, activeTab, icon }) => (
        <div key={id + activeTab} className="w-full flex items-center p-4">
          <Link to={link} className="w-full flex items-center">
            {icon}
            <h5
              className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
                active === activeTab ? 'text-[crimson]' : 'text-[#555]'
              }`}>
              {name}
            </h5>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default DashboardSideBar;
