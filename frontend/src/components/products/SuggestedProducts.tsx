import { useEffect, useState } from 'react';
import styles from '../../styles/styles';
import { useAppSelector } from '../../redux/hook';
import ProductCard from './ProductCard';
import { Product } from '../../utils/Interfaces';

const SuggestedProducts = ({ data }: { data: Product }) => {
  const { allProducts } = useAppSelector((state) => state.products);
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const d = allProducts?.filter(
      (product: Product) => product.category.value === data.category.value
    );
    setSuggestedProducts(d);

    return () => {
      setSuggestedProducts([]);
    };
  }, [allProducts, data]);

  return (
    <div>
      {data ? (
        <div className={`p-4 ${styles.section}`}>
          <h2 className={`${styles.heading} text-[25px] font-[500] border-b mb-5`}>
            Related Product
          </h2>
          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
            {suggestedProducts?.map((product: Product, index: number) => (
              <ProductCard data={product} key={index} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SuggestedProducts;
