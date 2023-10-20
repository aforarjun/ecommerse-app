import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
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
import { CreateProductSchema } from '../../../utils/formSchema';

const CreateProduct = () => {
  const { seller } = useAppSelector((state) => state.seller);
  const { success, error } = useAppSelector((state) => state.products);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(clearErrors());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success('Product created successfully!');
      navigate('/seller/dashboard');
    }
  }, [dispatch, error, success, navigate]);

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
    const { category, description, discountPrice, images, name, originalPrice, stock, tags } = data;

    const newForm = new FormData();

    for (const image of images) {
      newForm.append('images', image);
    }
    newForm.append('description', description);
    newForm.append('discountPrice', discountPrice);
    newForm.append('name', name);
    newForm.append('originalPrice', originalPrice);
    newForm.append('sellerId', seller!._id);
    newForm.append('stock', stock);
    newForm.append('tags', tags);
    newForm.append('category', JSON.stringify(category));

    await dispatch(createProduct(newForm));
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
          type="textarea"
          label="Description"
          placeholder="Enter product Description..."
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
