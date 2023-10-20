import { useState } from 'react';
import { AiOutlineCamera } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../../../redux/hook';

import { updateSellerAvatar, updateSellerInfo } from '../../../../redux/reducers/sellerSlice';
import Button from '../../../../components/Button';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { UpdateShopSchema } from '../../../../utils/formSchema';
import { InputText } from '../../../../components/input-components';

const SellerSettings = () => {
  const { seller } = useAppSelector((state) => state.seller);
  const dispatch = useAppDispatch();

  const [avatar, setAvatar] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(UpdateShopSchema),
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: {
      name: seller?.name,
      shopName: seller?.shopName,
      email: seller?.email,
      phoneNumber: String(seller?.phoneNumber),
      address: {
        country: seller?.address.country,
        city: seller?.address.city,
        address1: seller?.address.address1,
        address2: seller?.address.address2,
        zipCode: String(seller?.address.zipCode)
      }
    }
  });

  const updateHandler = async (data: any) => {
    setIsLoading(true);
    const { payload }: any = await dispatch(updateSellerInfo({ _id: seller?._id, ...data }));
    console.log(payload);

    if (payload?.success) {
      setIsLoading(false);
      toast.success('Shop info updated succesfully!');
    } else {
      setIsLoading(false);
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

      const { payload }: any = await dispatch(updateSellerAvatar(formData));

      if (payload.success) {
        toast.success('avatar updated successfully!');
      } else {
        setAvatar(seller?.avatar);
        toast.error(payload.data.message);
      }
    };
  };

  return (
    <div className="w-full h-[90vh] overflow-y-scroll flex flex-col items-center">
      <div className="flex w-full 800px:w-[80%] flex-col justify-center my-5">
        <div className="w-full flex items-center justify-center">
          <div className="relative">
            <img
              src={avatar ? avatar : `${seller?.avatar}`}
              alt=""
              className="w-[200px] h-[200px] rounded-full cursor-pointer"
            />
            <div className="w-[30px] h-[30px] bg-[#E3E9EE] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[10px] right-[15px]">
              <input type="file" id="image" className="hidden" onChange={handleImage} />
              <label htmlFor="image">
                <AiOutlineCamera />
              </label>
            </div>
          </div>
        </div>

        {/* shop info */}
        <form className="w-full flex flex-col items-center" onSubmit={handleSubmit(updateHandler)}>
          <InputText
            control={control}
            name="name"
            error={errors.name}
            type="text"
            label="Full name"
            readOnly
          />
          <br />

          <InputText
            control={control}
            name="shopName"
            error={errors.shopName}
            type="text"
            label="Shop Name"
          />
          <br />

          <InputText
            control={control}
            name="email"
            error={errors.email}
            type="email"
            label="Shop Email"
            readOnly
          />
          <br />

          <InputText
            control={control}
            name="phoneNumber"
            error={errors.phoneNumber}
            label="Shop Number"
          />
          <br />

          <InputText
            control={control}
            name="address.country"
            error={errors.address?.country}
            value={seller?.address.country.value}
            label="Select Country"
            readOnly
          />
          <br />

          <InputText
            control={control}
            name="address.city"
            label="Select City"
            value={seller?.address.city.value}
            error={errors.address?.city}
            readOnly
          />
          <br />

          <InputText
            control={control}
            name="address.address1"
            error={errors.address?.address1}
            type="text"
            label="Address 1"
          />
          <br />

          <InputText
            control={control}
            name="address.address2"
            error={errors.address?.address2}
            type="text"
            label="Address 2"
          />
          <br />

          <InputText
            control={control}
            label="Zip Code"
            name="address.zipCode"
            error={errors.address?.zipCode}
          />

          <br />
          <br />

          <Button title="Update Shop" type="submit" disabled={isLoading} loading={isLoading} />
        </form>
      </div>
    </div>
  );
};

export default SellerSettings;
