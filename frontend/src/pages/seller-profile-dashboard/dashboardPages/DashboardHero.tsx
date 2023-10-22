import React, { useEffect } from 'react';
import { AiOutlineArrowRight, AiOutlineMoneyCollect } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { MdBorderClear } from 'react-icons/md';
import { Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import styles from '../../../styles/styles';
import { getSellerOrders } from '../../../redux/reducers/ordersSlice';
import { getSellerProducts } from '../../../redux/reducers/productsSlice';

const DashboardHero = () => {
  const dispatch = useAppDispatch();
  const { sellerOrders } = useAppSelector((state) => state.order);
  const { seller } = useAppSelector((state) => state.seller);
  const { products } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(getSellerOrders(seller!._id));
    dispatch(getSellerProducts(seller!._id));
  }, [seller, dispatch]);

  const availableBalance = seller?.availableBalance;

  const columns: any = [
    { field: 'id', headerName: 'Order ID', minWidth: 150, flex: 0.7 },

    {
      field: 'status',
      headerName: 'Status',
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params: any) =>
        params.getValue(params.id, 'status') === 'Delivered' ? 'greenColor' : 'redColor'
    },
    {
      field: 'itemsQty',
      headerName: 'Items Qty',
      type: 'number',
      minWidth: 130,
      flex: 0.7
    },

    {
      field: 'total',
      headerName: 'Total',
      type: 'number',
      minWidth: 130,
      flex: 0.8
    },

    {
      field: ' ',
      flex: 1,
      minWidth: 150,
      headerName: '',
      type: 'number',
      sortable: false,
      renderCell: (params: any) => (
        <Link to={`/seller/dashboard/order/${params.id}`}>
          <Button>
            <AiOutlineArrowRight size={20} />
          </Button>
        </Link>
      )
    }
  ] as {
    field: string;
    flex: number;
    minWidth: number;
    headerName: string;
    type: string;
    sortable: boolean;
    renderCell: () => any;
  }[];

  const row: any = [];

  sellerOrders?.forEach((item: any) => {
    row.push({
      id: item._id,
      itemsQty: item.cart.reduce((acc: any, item: any) => acc + item.qty, 0),
      total: 'US$ ' + item.totalPrice,
      status: item.status
    });
  });

  return (
    <div className="w-full p-8">
      <h3 className="text-[22px] font-Poppins pb-2">Overview</h3>
      <div className="w-full block 800px:flex items-center justify-between">
        <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
          <div className="flex items-center">
            <AiOutlineMoneyCollect size={30} className="mr-2" fill="#00000085" />
            <h3
              className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}>
              Account Balance <span className="text-[16px]">(with 10% service charge)</span>
            </h3>
          </div>
          <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">${availableBalance}</h5>
          <Link to="/seller/dashboard/withdraw-money">
            <h5 className="pt-4 pl-[2] text-[#077f9c]">Withdraw Money</h5>
          </Link>
        </div>

        <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
          <div className="flex items-center">
            <MdBorderClear size={30} className="mr-2" fill="#00000085" />
            <h3
              className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}>
              All Orders
            </h3>
          </div>
          <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">{sellerOrders?.length}</h5>
          <Link to="/seller/dashboard/all-orders">
            <h5 className="pt-4 pl-2 text-[#077f9c]">View Orders</h5>
          </Link>
        </div>

        <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
          <div className="flex items-center">
            <AiOutlineMoneyCollect size={30} className="mr-2" fill="#00000085" />
            <h3
              className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}>
              All Products
            </h3>
          </div>
          <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">{products && products.length}</h5>
          <Link to="/seller/dashboard/products">
            <h5 className="pt-4 pl-2 text-[#077f9c]">View Products</h5>
          </Link>
        </div>
      </div>
      <br />

      <h3 className="text-[22px] font-Poppins pb-2">Latest Orders</h3>
      <div className="w-full min-h-[45vh] bg-white rounded">
        <DataGrid rows={row} columns={columns} disableRowSelectionOnClick autoHeight />
      </div>
    </div>
  );
};

export default DashboardHero;
