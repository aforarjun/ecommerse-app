import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { FiExternalLink } from 'react-icons/fi';
import { toast } from 'react-toastify';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import isEmailValidator from 'validator/lib/isEmail';

import styles from '../../styles/styles';
import { InputPassword, InputText } from '../../components/input-components';
import Button from '../../components/Button';
import { loginSeller } from '../../redux/reducers/sellerSlice';

import { Modal } from '@mui/material';
import { registerRequest } from '../../redux/reducers/sellerSlice';
import Loader from '../../components/Loader';

export const LoginShopSchema = yup.object().shape({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required')
    .test(
      'is-valid',
      (message: any) => `${message.path} is invalid`,
      (value: any) =>
        value ? isEmailValidator(value) : new yup.ValidationError('Invalid email format')
    )
    .default(''),
  password: yup.string().required('Password is required').default('')
});

const ShopLoginPage = () => {
  const navigate = useNavigate();
  const { isLoading, isSeller, seller } = useAppSelector((state) => state.seller);
  const { isAuthenticated, user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const [openModal, setOpenModal] = useState<boolean>(false);

  useEffect(() => {
    if (isSeller) {
      navigate(`/seller/${seller?._id}`);
    }
  }, [isSeller, seller?._id, navigate]);

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(LoginShopSchema),
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const login = async (data: { email: string; password: string }) => {
    try {
      const { payload }: any = await dispatch(loginSeller(data));

      if (payload.data.success) {
        toast.success('Seller LoggedIn Successfully');
        navigate(`/seller/${seller?._id}`);
      } else {
        toast.error(payload?.data?.message);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Login to your shop
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6">
            <InputText
              control={control}
              name="email"
              error={errors.email}
              type="email"
              label="Email Address"
              placeholder="Email"
              required
              autoComplete="email"
            />

            <InputPassword
              control={control}
              name="password"
              error={errors.password}
              label="Password"
              placeholder="Password"
              required
            />

            <div className={`${styles.noramlFlex} justify-between`}>
              <div></div>
              <div className="text-sm">
                <Link
                  to="/seller/forget-password"
                  className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <Button
              title="Sign In"
              type="submit"
              onClick={handleSubmit(login)}
              loading={isLoading}
            />

            <div className={`${styles.noramlFlex} w-full`}>
              <h4>Not have any account?</h4>
              {isAuthenticated ? (
                <p onClick={() => setOpenModal(true)} className="text-blue-600 pl-2 cursor-pointer">
                  Create Seller Account
                </p>
              ) : (
                <Link to="/seller/create" className="text-blue-600 pl-2 cursor-pointer">
                  Create Seller Account
                </Link>
              )}
            </div>
          </form>
        </div>
      </div>

      {isAuthenticated && (
        <CreateSellerModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          sellerIsLoading={isLoading}
          user={user}
          seller={seller}
        />
      )}
    </div>
  );
};

export default ShopLoginPage;

const CreateSellerModal = ({ openModal, setOpenModal, sellerIsLoading, user, seller }: any) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const { payload }: any = await dispatch(registerRequest({ email: user!.email }));
      if (payload.data.success) {
        toast.success('Seller LoggedIn Successfully');
        navigate(`/seller/${seller?._id}`);
      } else {
        toast.error(payload?.data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      open={openModal}
      onClose={() => setOpenModal(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description">
      <div>
        {sellerIsLoading ? (
          <Loader />
        ) : (
          <div className="w-[500px] p-5 bg-white text-center translate-x-[50%] translate-y-[50%]">
            <h2
              className="text-xl flex items-center gap-1 justify-center cursor-pointer"
              onClick={handleSubmit}>
              <span>Convert user account to the seller account</span> <FiExternalLink size={25} />
            </h2>

            <br />

            <h2 className="text-2xl text-bold">OR</h2>

            <br />

            <Link to="/seller/create">
              <h2 className="text-xl flex items-center gap-1 justify-center">
                <span>Create a new Seller account</span> <FiExternalLink size={25} />
              </h2>
            </Link>
          </div>
        )}
      </div>
    </Modal>
  );
};
