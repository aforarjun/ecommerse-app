import { useEffect, useState } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { AiOutlineDelete } from 'react-icons/ai';
import { RxCross1 } from 'react-icons/rx';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import { axiosInstance } from '../../../server';
import Loader from '../../../components/Loader';
import styles from '../../../styles/styles';
import { getSellerProducts } from '../../../redux/reducers/productsSlice';
import Button from '../../../components/Button';

const AllCoupons = () => {
  const { seller } = useAppSelector((state) => state.seller);
  const { products } = useAppSelector((state) => state.products);
  const dispatch = useAppDispatch();

  const [open, setOpen] = useState(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [coupons, setCoupons] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState<any>(null);

  const [name, setName] = useState<string>('');
  const [minAmount, setMinAmout] = useState<number>();
  const [maxAmount, setMaxAmount] = useState<number>();
  const [value, setValue] = useState<any>(null);

  useEffect(() => {
    setIsLoading(true);
    dispatch(getSellerProducts(seller!._id));

    axiosInstance
      .get(`/coupon/get-coupon-codes/${seller!._id}`, { withCredentials: true })
      .then(({ data }) => {
        setIsLoading(false);
        setCoupons(data.couponCodes);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [dispatch, seller]);

  const handleDelete = async (id: string) => {
    axiosInstance
      .delete(`/coupon/delete-coupon-code/${id}`, { withCredentials: true })
      .then((res) => {
        toast.success('Coupon code deleted succesfully!');
      });
    window.location.reload();
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const couponData = {
      name,
      minAmount,
      maxAmount,
      product: JSON.parse(selectedProducts),
      value,
      sellerId: seller!._id
    };

    await axiosInstance
      .post(`/coupon/create-coupon-code`, couponData, { withCredentials: true })
      .then(() => {
        toast.success('Coupon code created successfully!');
        setOpen(false);
        window.location.reload();
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      })
      .finally(() => {
        setOpen(false);
      });
  };

  const columns: any = [
    { field: 'id', headerName: 'Id', minWidth: 150, flex: 0.7 },
    {
      field: 'name',
      headerName: 'Coupon Code',
      minWidth: 180,
      flex: 1.4
    },
    {
      field: 'price',
      headerName: 'Value',
      minWidth: 100,
      flex: 0.6
    },
    {
      field: 'Delete',
      flex: 0.8,
      minWidth: 120,
      headerName: '',
      type: 'number',
      sortable: false,
      renderCell: (params: any) => {
        return (
          <Button onClick={() => handleDelete(params.id)} icon={<AiOutlineDelete size={20} />} />
        );
      }
    }
  ];

  const row: any = [];

  coupons &&
    coupons.forEach((coupon: any) => {
      row.push({
        id: coupon._id,
        name: coupon.name,
        price: coupon.value + ' %',
        sold: 10
      });
    });

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <div className="w-full flex justify-end">
            <div
              className={`${styles.button} !w-max !h-[45px] px-3 !rounded-[5px] mr-3 mb-3`}
              onClick={() => setOpen(true)}>
              <span className="text-white">Create Coupon Code</span>
            </div>
          </div>

          <DataGrid rows={row} columns={columns} disableSelectionOnClick autoHeight />

          {open && (
            <div className="fixed top-0 left-0 w-full h-screen bg-[#00000062] z-[20000] flex items-center justify-center">
              <div className="w-[90%] 800px:w-[40%] bg-white rounded-md shadow p-4">
                <div className="w-full flex justify-end">
                  <RxCross1 size={30} className="cursor-pointer" onClick={() => setOpen(false)} />
                </div>
                <h5 className="text-[30px] font-Poppins text-center">Create Coupon code</h5>
                {/* create coupoun code */}
                <form onSubmit={handleSubmit}>
                  <br />
                  <div>
                    <label className="pb-2">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={name}
                      className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your coupon code name..."
                    />
                  </div>
                  <br />
                  <div>
                    <label className="pb-2">
                      Discount Percentenge <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="value"
                      value={value}
                      required
                      className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      onChange={(e: any) => setValue(e.target.value)}
                      placeholder="Enter your coupon code value..."
                    />
                  </div>
                  <br />
                  <div>
                    <label className="pb-2">Min Amount</label>
                    <input
                      type="number"
                      name="value"
                      value={minAmount}
                      className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      onChange={(e: any) => setMinAmout(e.target.value)}
                      placeholder="Enter your coupon code min amount..."
                    />
                  </div>
                  <br />
                  <div>
                    <label className="pb-2">Max Amount</label>
                    <input
                      type="number"
                      name="value"
                      value={maxAmount}
                      className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      onChange={(e: any) => setMaxAmount(e.target.value)}
                      placeholder="Enter your coupon code max amount..."
                    />
                  </div>
                  <br />
                  <div>
                    <label className="pb-2">Selected Product</label>
                    <select
                      className="w-full mt-2 border h-[35px] rounded-[5px]"
                      value={selectedProducts}
                      onChange={(e: any) => setSelectedProducts(e.target.value)}>
                      <option value="Choose your selected products">
                        Choose a selected product
                      </option>
                      {products &&
                        products.map((product: any) => (
                          <option value={JSON.stringify(product)} key={product.name}>
                            {product.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <br />

                  <div>
                    <Button type="submit" title="Create" wrapperStyle={{ width: '100%' }} />
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AllCoupons;
