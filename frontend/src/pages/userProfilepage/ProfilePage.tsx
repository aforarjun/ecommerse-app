import { useState } from "react";
import { useAppSelector } from "../../redux/hook";
import Header from "../../components/header/Header";
import Loader from "../../components/Loader";
import styles from "../../styles/styles";
import ProfileSideBar from "./ProfileSideBar";
import { Address, AllOrders, AllRefundOrders, ChangePassword, PaymentMethod, ProfileSection, TrackOrder } from "./ProfileContent";
import { Route, Routes } from "react-router-dom";
import ErrorPage from "../ErrorPage";

const ProfilePage = () => {
    const { isLoading } = useAppSelector((state) => state.user);
    const [active, setActive] = useState<number>(1);

    return (
        <div>
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <Header />
                    <div className={`${styles.section} flex bg-[#f5f5f5] py-10`}>
                        <div className="w-[50px] 800px:w-[335px] sticky 800px:mt-0 mt-[18%]">
                            <ProfileSideBar active={active} setActive={setActive} />
                        </div>

                        <Routes>
                            <Route path="/" element={<ProfileSection />} />
                            <Route path="/allOrders" element={<AllOrders />} />
                            <Route path="/allRefundOrders" element={<AllRefundOrders />} />
                            <Route path="/trackOrder" element={<TrackOrder />} />
                            <Route path="/changePassword" element={<ChangePassword />} />
                            <Route path="/address" element={<Address />} />
                            <Route path="/paymentMethod" element={<PaymentMethod />} />

                            <Route path="*" element={<ErrorPage />} />
                        </Routes>
                    </div>
                </>
            )}
        </div>
    );
};

export default ProfilePage;