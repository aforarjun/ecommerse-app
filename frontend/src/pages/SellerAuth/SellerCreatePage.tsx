import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { CreateSellerSchema } from '../../utils/formSchema';
import {
  InputPassword,
  InputSelectCountryState,
  InputText,
  UploadImage
} from '../../components/input-components';
import { Country, State } from 'country-state-city';
import Button from '../../components/Button';
import styles from '../../styles/styles';
import { toast } from 'react-toastify';
import { registerRequest } from '../../redux/reducers/sellerSlice';

const ShopCreatePage = () => {
  const navigate = useNavigate();
  const { isLoading, isSeller, seller } = useAppSelector((state) => state.seller);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isSeller) {
      navigate(`/seller/${seller?._id}`);
    }
  }, [isSeller, seller?._id, navigate]);

  const [selectedCountry, setSelectedCountry] = useState<any>();
  const [states, setStates] = useState<any>([]);

  useEffect(() => {
    if (selectedCountry) {
      const code = JSON.parse(selectedCountry).index;
      setStates(() => State.getStatesOfCountry(code));
    }
  }, [selectedCountry, navigate]);

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(CreateSellerSchema),
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: {}
  });

  const createShop = async (data: any) => {
    console.log(data);
    const { confirmPassword, ...otherSeller } = data;
    const newForm = new FormData();

    newForm.append('name', otherSeller.name);
    newForm.append('email', otherSeller.email);
    newForm.append('address', JSON.stringify(otherSeller.address));
    newForm.append('password', otherSeller.password);
    newForm.append('shopName', otherSeller.shopName);
    newForm.append('phoneNumber', otherSeller.phoneNumber);
    newForm.append('file', otherSeller.avatar);

    try {
      const { payload }: any = await dispatch(registerRequest(newForm));
      toast.success(payload.data.message);
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Register as a seller
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[35rem]">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(createShop)}>
            <InputText
              control={control}
              name="name"
              error={errors.name}
              type="text"
              label="Full name"
              placeholder="First Last name"
            />

            <InputText
              control={control}
              name="shopName"
              error={errors.shopName}
              type="text"
              label="Shop Name"
              placeholder="Enter shop name"
            />

            <InputText
              control={control}
              name="email"
              error={errors.email}
              type="email"
              label="Shop Email"
              placeholder="Enter your shop email"
            />

            <InputText
              control={control}
              name="phoneNumber"
              error={errors.phoneNumber}
              label="Shop Number"
              placeholder="Enter your phone number"
            />

            <InputSelectCountryState
              control={control}
              name="address.country"
              error={errors.address?.country}
              label="Select Country"
              optionList={Country.getAllCountries()}
              setSelected={setSelectedCountry}
            />
            <InputSelectCountryState
              control={control}
              name="address.city"
              error={errors.address?.city}
              label="Select City"
              optionList={states}
            />
            <InputText
              control={control}
              name="address.address1"
              error={errors.address?.address1}
              type="text"
              label="Address 1"
              placeholder="Enter your full address"
            />
            <InputText
              control={control}
              name="address.address2"
              error={errors.address?.address2}
              type="text"
              label="Address 2"
              placeholder="Enter your alternate address"
            />
            <InputText
              control={control}
              name="address.zipCode"
              error={errors.address?.zipCode}
              label="Enter Zip Code"
            />

            <InputPassword
              control={control}
              name="password"
              error={errors.password}
              label="Password"
              placeholder="Password"
            />

            <InputPassword
              control={control}
              name="confirmPassword"
              error={errors.confirmPassword}
              label="Confirm Password"
              placeholder="Password"
            />

            <UploadImage control={control} name="avatar" error={errors.avatar} />

            <Button title="Register" type="submit" loading={isLoading} disabled={isLoading} />

            <div className={`${styles.noramlFlex} w-full`}>
              <h4>Already have an account?</h4>
              <Link to="/seller/login" className="text-blue-600 pl-2">
                Login to your seller Account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShopCreatePage;
