import React, { useEffect, useState } from 'react';
import styles from '../../styles/styles';
import ProductCard from '../../components/products/ProductCard';
import { useAppSelector } from '../../redux/hook';

const BestDeals = () => {
  const [bestDeal, setBestDeal] = useState<any>([]);
  const { allProducts } = useAppSelector((state) => state.products);

  useEffect(() => {
    const allProductsData = allProducts ? [...allProducts] : [];
    const sortedData = allProductsData?.sort((a: any, b: any) => b.sold_out - a.sold_out);
    const firstFive = sortedData && sortedData.slice(0, 5);
    setBestDeal(firstFive);
  }, [allProducts]);

  return (
    <div>
      <div className={`${styles.section}`}>
        <div className={`${styles.heading}`}>
          <h1>Best Deals</h1>
        </div>
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12 border-0">
          {bestDeal &&
            bestDeal.map((deal: any, index: number) => <ProductCard data={deal} key={index} />)}
        </div>
      </div>
    </div>
  );
};

export default BestDeals;
