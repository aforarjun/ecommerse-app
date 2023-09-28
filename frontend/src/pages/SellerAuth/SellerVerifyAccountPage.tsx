import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { toast } from 'react-toastify';
import { verifySeller } from '../../redux/reducers/sellerSlice';

const ShopVerifyAccountPage = () => {
  const { isSeller, isLoading, error, seller } = useAppSelector((state) => state.seller);
  console.log(seller);
  const params = useParams();
  const token = params['*'];

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSeller) {
      navigate(`/seller/${seller?._id}`);
    }

    if (token && !isSeller) {
      const verifyEmail = async () => {
        const { payload }: any = await dispatch(verifySeller({ verificationToken: `${token}` }));

        if (payload.success) {
          toast.success('Account is verified successfully.');
          setTimeout(() => {
            navigate(`/seller/${seller?._id}`);
          }, 1000);
        }
      };

      verifyEmail();
    }
  }, [token, isSeller]);

  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
      {isLoading ? (
        <p>Verifying... Please wait.</p>
      ) : error ? (
        <p>Your token is expired or not a valid token!</p>
      ) : (
        <p>Your account has been created suceessfully!</p>
      )}
    </div>
  );
};

export default ShopVerifyAccountPage;
