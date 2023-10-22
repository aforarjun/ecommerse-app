import { Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineArrowRight } from 'react-icons/ai';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import Loader from '../../../components/Loader';
import { getSellerOrders } from '../../../redux/reducers/ordersSlice';

const AllOrders = () => {
  const { sellerOrders, isLoading } = useAppSelector((state) => state.order);
  const { seller } = useAppSelector((state) => state.seller);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getSellerOrders(seller!._id));
  }, [dispatch, seller]);

  const columns: any = [
    { field: 'id', headerName: 'Order ID', minWidth: 150, flex: 0.7 },

    {
      field: 'status',
      headerName: 'Status',
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params: any) => {
        return params.getValue(params.id, 'status') === 'Delivered' ? 'greenColor' : 'redColor';
      }
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
      renderCell: (params: any) => {
        return (
          <>
            <Link to={`/seller/dashboard/order/${params.id}`}>
              <Button>
                <AiOutlineArrowRight size={20} />
              </Button>
            </Link>
          </>
        );
      }
    }
  ];

  const row: any = [];

  sellerOrders?.forEach((order: any) => {
    row.push({
      id: order._id,
      itemsQty: order.cart.length,
      total: 'US$ ' + order.totalPrice,
      status: order.status
    });
  });

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <DataGrid rows={row} columns={columns} disableRowSelectionOnClick autoHeight />
        </div>
      )}
    </>
  );
};

export default AllOrders;
