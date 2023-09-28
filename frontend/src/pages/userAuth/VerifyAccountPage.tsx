import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { activateUser } from '../../redux/reducers/userSlice';
import { toast } from 'react-toastify';

const VerifyAccountPage = () => {
    const params = useParams();
    const token = params["*"];

    const { isAuthenticated, isLoading, error } = useAppSelector(state => state.user)
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/')
        }

        if (token && !isAuthenticated) {
            const verifyEmail = async () => {
                console.log("first")
                const { payload } = await dispatch(activateUser({ verificationToken: `${token}` }));
                if (payload.success) {
                    setTimeout(() => {
                        navigate('/');
                    }, 1000)
                    toast.success("Account is verified successfully.")
                }
            }

            verifyEmail();
        }
    }, [token, isAuthenticated, dispatch, navigate])


    return (
        <div
            style={{
                width: "100%",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            {isLoading ? (<p>Verifying... Please wait.</p>) : (
                error ? (
                    <p>Your token is expired or not a valid token!</p>
                ) : (
                    <p>Your account has been created suceessfully!</p>
                )
            )}
        </div>
    )
}

export default VerifyAccountPage