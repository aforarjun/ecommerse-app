import { Navigate } from "react-router-dom";
import { useAppSelector } from "../redux/hook";
import Loader from "../components/Loader";

const SellerProtectedRoute = ({ children }: any) => {
    const { isLoading, isSeller } = useAppSelector((state) => state.seller);

    if (isLoading) {
        return <Loader />;
    } else {
        if (!isSeller) {
            return <Navigate to={`/seller/login`} replace />;
        }

        return children;
    }
};

export default SellerProtectedRoute;