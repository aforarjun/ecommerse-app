import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "../styles/styles";
import { useAppSelector } from "../redux/hook";
import Loader from "../components/Loader";
import Header from "../components/header/Header";
import ProductCard from "../components/productCard/ProductCard";
import Footer from "../components/footer/Footer";

const ProductsPage = () => {
    const [searchParams] = useSearchParams();
    const category = searchParams.get("category");
    const { allProducts, isLoading } = useAppSelector((state) => state.products);
    const [data, setData] = useState<any>([]);

    useEffect(() => {
        if (category === null) {
            setData(allProducts);
        } else {
            const products = allProducts?.filter((product: any) => product.category === category);
            setData(products);
        }
        //    window.scrollTo(0,0);
    }, [allProducts]);

    return (
        <>
            {
                isLoading ? (
                    <Loader />
                ) : (
                    <div>
                        <Header activeHeading={3} />

                        <br />
                        <br />
                        <div className={`${styles.section}`}>
                            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
                                {data && data?.map((i: any, index: number) => <ProductCard data={i} key={index} />)}
                            </div>
                            {data.length === 0 ? (
                                <h1 className="text-center w-full pb-[100px] text-[20px]">
                                    No products Found!
                                </h1>
                            ) : null}
                        </div>

                        <Footer />
                    </div>
                )
            }
        </>
    );
};

export default ProductsPage;