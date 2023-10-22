import { useEffect } from 'react';
import { Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { AiOutlineDelete, AiOutlineEye } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import Loader from '../../../components/Loader';
import { deleteEvent, getSellerEvents } from '../../../redux/reducers/eventsSlice';

const AllEvents = () => {
  const { events, isLoading } = useAppSelector((state) => state.events);
  const { seller } = useAppSelector((state) => state.seller);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (seller?._id) {
      dispatch(getSellerEvents(seller._id));
    }
  }, [seller, dispatch]);

  const handleDelete = (id: string) => {
    dispatch(deleteEvent(id));
  };

  const columns: any = [
    { field: 'id', headerName: 'Product Id', minWidth: 150, flex: 0.7 },
    {
      field: 'name',
      headerName: 'Name',
      minWidth: 180,
      flex: 1.4
    },
    {
      field: 'price',
      headerName: 'Price',
      minWidth: 100,
      flex: 0.6
    },
    {
      field: 'Stock',
      headerName: 'Stock',
      type: 'number',
      minWidth: 80,
      flex: 0.5
    },

    {
      field: 'sold',
      headerName: 'Sold out',
      type: 'number',
      minWidth: 130,
      flex: 0.6
    },
    {
      field: 'Preview',
      flex: 0.8,
      minWidth: 100,
      headerName: '',
      type: 'number',
      sortable: false,
      renderCell: (params: { id: string }) => {
        return (
          <>
            <Link to={`/product/${params.id}?isEvent=true`}>
              <Button>
                <AiOutlineEye size={20} />
              </Button>
            </Link>
          </>
        );
      }
    },
    {
      field: 'Delete',
      flex: 0.8,
      minWidth: 120,
      headerName: '',
      type: 'number',
      sortable: false,
      renderCell: (params: { id: string }) => {
        return (
          <>
            <Button onClick={() => handleDelete(params.id)}>
              <AiOutlineDelete size={20} />
            </Button>
          </>
        );
      }
    }
  ];

  const row: any = [];

  events &&
    events.forEach((event: any) => {
      row.push({
        id: event._id,
        name: event.name,
        price: 'US$ ' + event.discountPrice,
        Stock: event.stock,
        sold: event.sold_out
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

export default AllEvents;
