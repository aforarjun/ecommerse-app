import React, { useEffect } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { Link } from 'react-router-dom';
import { AiOutlineArrowRight } from 'react-icons/ai';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import Loader from '../../../components/Loader';
import Button from '../../../components/Button';
import { getSellerOrders } from '../../../redux/reducers/ordersSlice';

const AllRefundOrders = () => {
  const { sellerOrders, isLoading } = useAppSelector((state) => state.order);
  const { seller } = useAppSelector((state) => state.seller);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getSellerOrders(seller!._id));
  }, [seller, dispatch]);

  const refundOrders = sellerOrders?.filter(
    (item: any) => item.status === 'Processing refund' || item.status === 'Refund Success'
  );

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
            <Link to={`/order/${params.id}`}>
              <Button icon={<AiOutlineArrowRight size={20} />} />
            </Link>
          </>
        );
      }
    }
  ];

  const row: any = [];

  refundOrders &&
    refundOrders.forEach((item: any) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.length,
        total: 'US$ ' + item.totalPrice,
        status: item.status
      });
    });

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <DataGrid rows={row} columns={columns} pageSize={10} disableSelectionOnClick autoHeight />
        </div>
      )}
    </>
  );
};

export default AllRefundOrders;
