import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  InputNumber,
  InputSelect,
  InputText,
  MultipleFileSelected
} from '../../../components/input-components';
import { categoriesData } from '../../../static/data';
import Button from '../../../components/Button';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import { clearErrors, createProduct } from '../../../redux/reducers/productsSlice';

const CreateProductSchema = yup.object().shape({
  images: yup.array().of(yup.string()).required('Project Images is required, (Atleast one.)'),
  name: yup.string().required('Project name is required.'),
  description: yup.string().required('Project description is required.'),
  category: yup
    .object({
      index: yup.number(),
      value: yup.string()
    })
    .required('Project category is required.'),
  tags: yup.string().required('Project tags is required.'),
  originalPrice: yup.number().required('Required'),
  discountPrice: yup.number().required('Required'),
  stock: yup.number().required('Required')
});

const CreateProduct = () => {
  const { seller } = useAppSelector((state) => state.seller);
  const { success, error } = useAppSelector((state) => state.products);
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
      toast.success('Product created successfully!');
      navigate('/seller/dashboard');
    }
  }, [dispatch, error, success]);

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(CreateProductSchema),
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: {}
  });

  const createProductHandle = async (data: any) => {
    const createProductData = { ...data, sellerId: seller?._id };

    await dispatch(createProduct(createProductData));
  };

  return (
    <div className="w-[90%] bg-white  shadow h-[80vh] rounded-[4px] p-3 overflow-y-scroll">
      <h5 className="text-[30px] font-Poppins text-center">Create Product</h5>
      {/* create product form */}
      <form onSubmit={handleSubmit(createProductHandle)} className="max-w-xl m-auto">
        <br />
        <InputText
          control={control}
          name="name"
          error={errors.name}
          type="text"
          label="Product Name"
          placeholder="Enter your product name..."
        />
        <br />
        <InputText
          control={control}
          name="description"
          error={errors.description}
          type="text"
          label="Description"
          placeholder="Enter product Description..."
          cols="30"
          rows="8"
        />
        <br />
        <InputSelect
          control={control}
          name="category"
          error={errors.category}
          label="Category"
          placeholder="Select product category"
          list={categoriesData}
        />
        <br />
        <InputText
          control={control}
          name="tags"
          error={errors.tags}
          type="text"
          label="Tags"
          placeholder="Enter your product tags..."
        />
        <br />
        <InputNumber
          control={control}
          name="originalPrice"
          error={errors.originalPrice}
          label="Original Price"
          placeholder="Enter your product originalPrice..."
        />
        <br />
        <InputNumber
          control={control}
          name="discountPrice"
          error={errors.discountPrice}
          label="Price (With Discount)"
          placeholder="Enter your product discount Price..."
        />
        <br />
        <InputNumber
          control={control}
          name="stock"
          error={errors.stock}
          label="Product Stock"
          placeholder="Enter your product stock..."
        />
        <br />

        <MultipleFileSelected
          control={control}
          name="images"
          error={errors.images}
          label="Product Images"
        />

        <div className="mt-4">
          <Button type="submit" title="Create" />
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
