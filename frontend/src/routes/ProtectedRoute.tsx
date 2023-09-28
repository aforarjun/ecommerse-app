import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../redux/hook';
import Loader from '../components/Loader';

const ProtectedRoute = ({ children }: any) => {
  const { isUserLoaded, isAuthenticated } = useAppSelector((state) => state.user);

  if (isUserLoaded) {
    return <Loader />;
  } else {
    if (!isAuthenticated) {
      return <Navigate to={`/auth/login`} replace />;
    }

    return children;
  }
};

export default ProtectedRoute;
