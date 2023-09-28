import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import { AiOutlineDelete, AiOutlineEye } from 'react-icons/ai';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import Loader from '../../../components/Loader';
import { deleteProduct, getSellerProducts } from '../../../redux/reducers/productsSlice';
import { toast } from 'react-toastify';

const AllProducts = () => {
  const { products, isLoading } = useAppSelector((state) => state.products);
  const { seller } = useAppSelector((state) => state.seller);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getSellerProducts(seller?._id!));
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    const { payload } = await dispatch(deleteProduct(id));
    if (payload.success) {
      toast.success('product Deleted');
    } else {
      toast.error('product Delete failed');
    }
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
            <Link to={`/product/${params.id}`}>
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

  products &&
    products.forEach((product: any) => {
      row.push({
        id: product._id,
        name: product.name,
        price: 'US$ ' + product.discountPrice,
        Stock: product.stock,
        sold: product?.sold_out
      });
    });

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <DataGrid rows={row} columns={columns} disableSelectionOnClick autoHeight />
        </div>
      )}
    </>
  );
};

export default AllProducts;
