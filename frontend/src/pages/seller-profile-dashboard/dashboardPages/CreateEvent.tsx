import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  InputDate,
  InputNumber,
  InputSelect,
  InputText,
  MultipleFileSelected
} from '../../../components/input-components';
import { categoriesData } from '../../../static/data';
import Button from '../../../components/Button';
import { clearErrors, createEvent } from '../../../redux/reducers/eventsSlice';
import { Event } from '../../../utils/Interfaces';
import { CreateEventSchema } from '../../../utils/formSchema';

const CreateProduct = () => {
  const { seller } = useAppSelector((state) => state.seller);
  const { isLoading, success, error } = useAppSelector((state) => state.events);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(clearErrors());
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success('Event created successfully!');
      navigate('/seller/dashboard/events');
      window.location.reload();
    }
  }, [dispatch, error, success]);

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(CreateEventSchema),
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: {}
  });

  const createEventHandle = async (data: any) => {
    const createEventData: Event = { ...data, sellerId: seller!._id };
    await dispatch(createEvent(createEventData));
    // if (payload?.success) {
    //   toast.success('Event Created successfully');
    //   navigate('/seller/dashboard/events');
    // } else {
    //   toast.error(payload?.data?.message || 'Something went wrong, Event failed.');
    // }
  };

  return (
    <div className="w-[90%] bg-white  shadow h-[80vh] rounded-[4px] p-3 overflow-y-scroll">
      <h5 className="text-[30px] font-Poppins text-center">Create Product</h5>
      {/* create product form */}
      <form onSubmit={handleSubmit(createEventHandle)} className="max-w-xl m-auto">
        <br />
        <InputText
          control={control}
          name="name"
          error={errors.name}
          type="text"
          label="Event Name"
          placeholder="Enter your event name..."
        />
        <br />
        <InputText
          control={control}
          name="description"
          error={errors.description}
          type="text"
          label="Description"
          placeholder="Enter event Description..."
          cols="30"
          rows="8"
        />
        <br />
        <InputSelect
          control={control}
          name="category"
          error={errors.category}
          label="Category"
          placeholder="Select event category"
          list={categoriesData}
        />
        <br />
        <InputText
          control={control}
          name="tags"
          error={errors.tags}
          type="text"
          label="Tags"
          placeholder="Enter your event tags..."
        />
        <br />
        <InputNumber
          control={control}
          name="originalPrice"
          error={errors.originalPrice}
          label="Original Price"
          placeholder="Enter your event originalPrice..."
        />
        <br />
        <InputNumber
          control={control}
          name="discountPrice"
          error={errors.discountPrice}
          label="Price (With Discount)"
          placeholder="Enter your event discount Price..."
        />
        <br />
        <InputNumber
          control={control}
          name="stock"
          error={errors.stock}
          label="Product Stock"
          placeholder="Enter your event stock..."
        />
        <br />

        <MultipleFileSelected
          control={control}
          name="images"
          error={errors.images}
          label="Product Images"
        />
        <br />

        <InputDate control={control} name="startDate" error={errors.startDate} label="Start Date" />
        <br />

        <InputDate control={control} name="endDate" error={errors.endDate} label="End Date" />
        <br />
        <br />

        <div className="mt-4">
          <Button type="submit" title="Create" disabled={isLoading} loading={isLoading} />
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
