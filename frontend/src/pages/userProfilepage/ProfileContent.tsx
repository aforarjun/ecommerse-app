import React, { useState } from 'react';
import { AiOutlineArrowRight, AiOutlineCamera, AiOutlineDelete } from 'react-icons/ai';
import styles from '../../styles/styles';
import { DataGrid } from '@material-ui/data-grid';
import { Link } from 'react-router-dom';
import { MdTrackChanges } from 'react-icons/md';
import { RxCross1 } from 'react-icons/rx';
import { Country, State } from 'country-state-city';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../redux/hook';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import isEmailValidator from 'validator/lib/isEmail';

import { InputText } from '../../components/input-components';
import Button from '../../components/Button';
import {
  deleteUserAddress,
  loadUser,
  updateUser,
  updateUserAddress,
  updateUserAvatar
} from '../../redux/reducers/userSlice';
import { getUserOrders } from '../../redux/reducers/ordersSlice';
import { axiosInstance } from '../../server';

const UserUpdateSchema = yup.object().shape({
  name: yup.string().default('').required('Name is required'),
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required')
    .test(
      'is-valid',
      (message) => `${message.path} is invalid`,
      (value) => (value ? isEmailValidator(value) : new yup.ValidationError('Invalid email format'))
    )
    .default(''),
  phoneNumber: yup
    .string()
    .nullable()
    .matches(/^[0-9]+$/, 'Must be only digits')
    .default('')
    .required('Required')
});

export const ProfileSection = () => {
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const [avatar, setAvatar] = useState<any>(user?.avatar);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(UserUpdateSchema),
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || ''
    }
  });

  const updateUserHandle = async (data: any) => {
    console.log(data);
    setLoading(true);
    const { payload }: any = await dispatch(updateUser(data));

    if (payload.success) {
      setLoading(false);
      toast.success('User updated');
      dispatch(loadUser());
    } else {
      setLoading(false);
      toast.error(payload.data.message);
    }
  };

  const handleImage = async (e: any) => {
    const file = e.target.files[0];
    const formData = new FormData();

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async (e: any) => {
      setAvatar(e.target?.result);
      formData.append('file', file);

      const { payload }: any = await dispatch(updateUserAvatar(formData));

      if (payload.success) {
        toast.success('avatar updated successfully!');
      } else {
        setAvatar(user?.avatar);
        toast.error(payload.data.message);
      }
    };
  };

  return (
    <div className="w-full">
      <div className="flex justify-center w-full">
        <div className="relative">
          <img
            src={`${avatar}`}
            className="w-[150px] h-[150px] rounded-full object-cover border-[3px] border-[#3ad132]"
            alt=""
          />
          <div className="w-[30px] h-[30px] bg-[#E3E9EE] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[5px] right-[5px]">
            <input
              type="file"
              id="image"
              className="hidden"
              onChange={(e: any) => handleImage(e)}
            />
            <label htmlFor="image">
              <AiOutlineCamera />
            </label>
          </div>
        </div>
      </div>
      <br />
      <br />
      <div className="w-full px-5">
        <form onSubmit={handleSubmit(updateUserHandle)}>
          <div className="w-full 800px:flex block pb-3 gap-2">
            <div className=" w-[100%] 800px:w-[50%]">
              <InputText
                control={control}
                name="name"
                error={errors.name}
                label="Full name"
                placeholder="Full name"
              />
            </div>
            <div className=" w-[100%] 800px:w-[50%]">
              <InputText
                control={control}
                name="email"
                error={errors.email}
                type="email"
                label="Email Address"
                placeholder="Enter Email"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="w-full 800px:flex block pb-3 gap-2">
            <div className=" w-[100%] 800px:w-[50%]">
              <InputText
                control={control}
                name="phoneNumber"
                error={errors.phoneNumber}
                type="number"
                label="Phone Number"
                placeholder="Enter Phone Number"
              />
            </div>
          </div>

          <Button title="Update" type="submit" loading={loading} disabled={loading} />
        </form>
      </div>
    </div>
  );
};

export const AllOrders = () => {
  const { user } = useAppSelector((state) => state.user);
  const { userOrders } = useAppSelector((state) => state.order);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getUserOrders(user!._id));
  }, [user, dispatch]);

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
          <Link to={`/profile/order/${params.id}`}>
            <Button icon={<AiOutlineArrowRight size={20} />} />
          </Link>
        );
      }
    }
  ];
  const row: any = [];

  userOrders?.forEach((order: any) => {
    row.push({
      id: order._id,
      itemsQty: order.cart.length,
      total: 'US$ ' + order.totalPrice,
      status: order.status
    });
  });

  return (
    <div className="w-full">
      <div className="pl-8 pt-1">
        <DataGrid rows={row} columns={columns} disableSelectionOnClick autoHeight />
      </div>
    </div>
  );
};

export const AllRefundOrders = () => {
  const { user } = useAppSelector((state) => state.user);
  const { userOrders } = useAppSelector((state) => state.order);
  const dispatch = useAppDispatch();
  const [eligibleOrders, setEligibleOrders] = useState<any>([]);

  useEffect(() => {
    const getRefundedOrders = async () => {
      await dispatch(getUserOrders(user!._id));

      setEligibleOrders(() =>
        userOrders.filter(
          (item: any) => item.status === 'Processing refund' || item.status === 'Refund Success'
        )
      );
    };
    getRefundedOrders();
  }, [user, userOrders, dispatch]);

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
          <Link to={`/profile/order/${params.id}`}>
            <Button icon={<AiOutlineArrowRight size={20} />} />
          </Link>
        );
      }
    }
  ];

  const row: any = [];

  eligibleOrders &&
    eligibleOrders.forEach((item: any) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.length,
        total: 'US$ ' + item.totalPrice,
        status: item.status
      });
    });

  return (
    <div className="w-full">
      <div className="pl-8 pt-1">
        <DataGrid rows={row} columns={columns} autoHeight disableSelectionOnClick />
      </div>
    </div>
  );
};

export const TrackOrder = () => {
  const { user } = useAppSelector((state) => state.user);
  const { userOrders } = useAppSelector((state) => state.order);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getUserOrders(user!._id));
  }, [user, dispatch]);

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
          <Link to={`/profile/trackOrder/${params.id}`}>
            <Button icon={<MdTrackChanges size={20} />} />
          </Link>
        );
      }
    }
  ];

  const row: any = [];
  userOrders?.forEach((item: any) => {
    row.push({
      id: item._id,
      itemsQty: item.cart.length,
      total: 'US$ ' + item.totalPrice,
      status: item.status
    });
  });

  return (
    <div className="w-full">
      <div className="pl-8 pt-1">
        <DataGrid rows={row} columns={columns} disableSelectionOnClick autoHeight />
      </div>
    </div>
  );
};

export const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);

  const passwordChangeHandler = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    await axiosInstance
      .put(
        `/user/update-password`,
        { oldPassword, newPassword, confirmPassword },
        { withCredentials: true }
      )
      .then((res: any) => {
        toast.success('Password Updated.');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setLoading(false);
      })
      .catch((error: any) => {
        console.log(error);
        toast.error(error.response.data.message);
        setLoading(false);
      });
  };

  return (
    <div className="w-full px-5">
      <h1 className="block text-[25px] text-center font-[600] text-[#000000ba] pb-2">
        Change Password
      </h1>
      <div className="w-full">
        <form onSubmit={passwordChangeHandler} className="flex flex-col items-center">
          <div className=" w-[100%] 800px:w-[50%] mt-5">
            <label className="block pb-2">Enter your old password</label>
            <input
              type="password"
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div className=" w-[100%] 800px:w-[50%] mt-2">
            <label className="block pb-2">Enter your new password</label>
            <input
              type="password"
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className=" w-[100%] 800px:w-[50%] mt-2">
            <label className="block pb-2">Enter your confirm password</label>
            <input
              type="password"
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <Button
              type="submit"
              title="Update"
              className={`w-[95%] h-[40px] border border-[#3a24db] text-center text-[#3a24db] rounded-[3px] mt-8 cursor-pointer`}
              disabled={loading}
              loading={loading}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export const Address = () => {
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState<any>();
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [addressType, setAddressType] = useState('');

  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const addressTypeData = [
    {
      name: 'Default'
    },
    {
      name: 'Home'
    },
    {
      name: 'Office'
    }
  ];

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (addressType === '' || country === '' || city === '') {
      toast.error('Please fill all the fields!');
    } else {
      setLoading(true);
      const { payload }: any = await dispatch(
        updateUserAddress({
          country,
          city,
          address1,
          address2,
          zipCode,
          addressType
        })
      );

      if (payload.success) {
        setOpen(false);
        setCountry('');
        setCity('');
        setAddress1('');
        setAddress2('');
        setZipCode(null);
        setAddressType('');

        setLoading(false);
        toast.success('Address updated.');
      } else {
        setLoading(false);
        toast.error(payload.data.message);
      }
    }
  };

  const handleDelete = async (item: any) => {
    setLoading(true);
    const id = item._id;
    const { payload }: any = await dispatch(deleteUserAddress(id));

    if (payload.success) {
      setLoading(false);
      toast.success('Address Deleted.');
    } else {
      setLoading(false);
      toast.error(payload.data.message);
    }
  };

  return (
    <div className="w-full px-5">
      {open && (
        <div className="fixed w-full h-screen bg-[#0000004b] top-0 left-0 flex items-center justify-center ">
          <div className="w-[60%] h-[80vh] bg-white rounded shadow relative overflow-y-scroll">
            <div className="w-full flex justify-end p-3">
              <RxCross1 size={30} className="cursor-pointer" onClick={() => setOpen(false)} />
            </div>
            <h1 className="text-center text-[25px] font-Poppins">Add New Address</h1>
            <div className="w-full">
              <form onSubmit={handleSubmit} className="w-full">
                <div className="w-full block p-4">
                  <div className="w-full pb-2">
                    <label className="block pb-2">Country</label>
                    <select
                      name=""
                      id=""
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-[95%] border h-[40px] rounded-[5px]">
                      <option value="" className="block border pb-2">
                        choose your country
                      </option>
                      {Country &&
                        Country.getAllCountries().map((item) => (
                          <option className="block pb-2" key={item.isoCode} value={item.isoCode}>
                            {item.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="w-full pb-2">
                    <label className="block pb-2">Choose your City</label>
                    <select
                      name=""
                      id=""
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-[95%] border h-[40px] rounded-[5px]">
                      <option value="" className="block border pb-2">
                        choose your city
                      </option>
                      {State &&
                        State.getStatesOfCountry(country).map((item) => (
                          <option className="block pb-2" key={item.isoCode} value={item.isoCode}>
                            {item.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="w-full pb-2">
                    <label className="block pb-2">Address 1</label>
                    <input
                      type="address"
                      className={`${styles.input}`}
                      required
                      value={address1}
                      onChange={(e) => setAddress1(e.target.value)}
                    />
                  </div>
                  <div className="w-full pb-2">
                    <label className="block pb-2">Address 2</label>
                    <input
                      type="address"
                      className={`${styles.input}`}
                      required
                      value={address2}
                      onChange={(e) => setAddress2(e.target.value)}
                    />
                  </div>

                  <div className="w-full pb-2">
                    <label className="block pb-2">Zip Code</label>
                    <input
                      type="number"
                      className={`${styles.input}`}
                      required
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                    />
                  </div>

                  <div className="w-full pb-2">
                    <label className="block pb-2">Address Type</label>
                    <select
                      name=""
                      id=""
                      value={addressType}
                      onChange={(e) => setAddressType(e.target.value)}
                      className="w-[95%] border h-[40px] rounded-[5px]">
                      <option value="" className="block border pb-2">
                        Choose your Address Type
                      </option>
                      {addressTypeData &&
                        addressTypeData.map((item) => (
                          <option className="block pb-2" key={item.name} value={item.name}>
                            {item.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className=" w-full pb-2">
                    <Button type="submit" title="Submit" loading={loading} disabled={loading} />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="flex w-full items-center justify-between">
        <h1 className="text-[20px] font-[600] text-[#000000ba] pb-2 800px:text-[30px]">
          My Addresses
        </h1>
        <Button title="Add New" onClick={() => setOpen(true)} />
      </div>
      <br />
      {user?.addresses.map((item, index) => (
        <div
          className="w-full bg-white h-min 800px:h-[70px] rounded-[4px] flex items-center px-3 shadow justify-between pr-10 mb-5"
          key={index}>
          <div className="flex items-center">
            <h5 className="pl-5 font-[600]">{item.addressType}</h5>
          </div>
          <div className="pl-8 flex items-center">
            <h6 className="text-[12px] 800px:text-[unset]">
              {item.address1} {item.address2}
            </h6>
          </div>
          <div className="pl-8 flex items-center">
            <h6 className="text-[12px] 800px:text-[unset]">{user?.phoneNumber}</h6>
          </div>
          <div className="min-w-[10%] flex items-center justify-between pl-8">
            <Button
              icon={<AiOutlineDelete size={25} />}
              loading={loading}
              className="cursor-pointer"
              onClick={() => handleDelete(item)}
            />
          </div>
        </div>
      ))}

      {user?.addresses.length === 0 && (
        <h5 className="text-center pt-8 text-[18px]">You not have any saved address!</h5>
      )}
    </div>
  );
};

export const PaymentMethod = () => {
  return (
    <div className="w-full px-5">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-[25px] font-[600] text-[#000] pb-2">Payment Methods</h1>
        <div className={`${styles.button} rounded-md`}>
          <span className="text-[#fff]">Add new</span>
        </div>
      </div>
      <br />
      <div className="w-full bg-white h-[70] rounded-[4px] flex items-center px-3 shadow justify-between pr-10">
        <div className="flex items-center">
          <img src="" alt="card" className="w-[100px] h-[80px]" />
          <h5 className="pl-8 flex items-center">Arjun Singh</h5>
        </div>
        <div className="flex items-center">
          <h6>1234 **** *** ****</h6>
          <h5 className="pl-8 flex items-center">08/2024</h5>
        </div>
        <div className="flex items-center">
          <AiOutlineDelete size={25} className="cursor-pointer" />
        </div>
      </div>
    </div>
  );
};
