import { useEffect, useState } from "react";
import { useAppSelector } from "../../redux/hook";
import Loader from "../../components/Loader";
import Header from "../../components/header/Header";
import styles from "../../styles/styles";
import ProductCard from "../../components/productCard/ProductCard";
import Footer from "../../components/footer/Footer";

const BestSellingPage = () => {
    const [data, setData] = useState([]);
    const { allProducts, isLoading } = useAppSelector((state) => state.products);

    useEffect(() => {
        const allProductsData = allProducts ? [...allProducts] : [];
        const sortedData = allProductsData?.sort((a: any, b: any) => b.sold_out - a.sold_out);
        setData(sortedData);
    }, [allProducts]);

    return (
        <>
            {
                isLoading ? (
                    <Loader />
                ) : (
                    <div>
                        <Header activeHeading={2} />
                        <br />
                        <br />
                        <div className={`${styles.section}`}>
                            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
                                {data.length ?
                                    data.map((i, index) =>
                                        <ProductCard data={i} key={index} />
                                    ) : (
                                        <p className="text-center size-xl">No Best selling for today.</p>
                                    )
                                }
                            </div>
                        </div>
                        <Footer />
                    </div>
                )
            }
        </>
    );
};

export default BestSellingPage;