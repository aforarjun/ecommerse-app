import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, redirect } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { SignupSchema } from '../../utils/formSchema';
import { InputText, InputPassword, UploadImage } from '../../components/input-components';
import styles from '../../styles/styles';
import Button from '../../components/Button';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { registerRequest } from '../../redux/reducers/userSlice';

function SignupPage() {
    const { isAuthenticated, isLoading } = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            redirect('/');
        }
    }, [isAuthenticated])


    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(SignupSchema),
        mode: 'all',
        reValidateMode: 'onChange',
        defaultValues: {
            name: "", email: "", password: ""
        }
    });

    const Signup = async (data: any) => {
        const { avatar, confirmPassword, ...otherUser } = data;

        const { payload }: any = await dispatch(registerRequest(otherUser));
        console.log(payload);

        if (payload.data.success) {
            setSuccess(true);
            toast.warning(payload.data.message);
        } else {
            toast.error(payload.data.message);
        }
    };

    return (
        <div className='min-h-screen bg-gray-50 flex flex-col justify-center px-2 py-12 sm:px-6 lg:px-8'>
            {!success ? (
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>Register a account</h2>
                    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                            <form className="space-y-6" onSubmit={handleSubmit(Signup)}>
                                <InputText
                                    control={control}
                                    name="name"
                                    error={errors.name}
                                    type="text"
                                    label="Full name"
                                    placeholder="First-last name"
                                />
                                <InputText
                                    control={control}
                                    name="email"
                                    error={errors.email}
                                    type="email"
                                    label="Email Address"
                                    placeholder="Email"
                                    autoComplete="email"
                                />

                                <InputPassword
                                    control={control}
                                    name="password"
                                    error={errors.password}
                                    label="Password"
                                    placeholder="Password"
                                />

                                <InputPassword
                                    control={control}
                                    name="confirmPassword"
                                    error={errors.confirmPassword}
                                    label="Confirm Password"
                                    placeholder="Password"
                                />


                                <UploadImage
                                    control={control}
                                    name="avatar"
                                    error={errors.avatar}
                                />

                                <Button
                                    title="Register"
                                    type="submit"
                                    loading={isLoading}
                                    disabled={isLoading}
                                />

                                <div className={`${styles.noramlFlex} w-full`}>
                                    <h4>Already have an account ?</h4>
                                    <Link to="/login" className="text-blue-600 pl-2">
                                        Sign In
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <h2 className='mt-6 text-center text-xl font-extrabold text-gray-900'>Visite your emial for varify/activate your account!</h2>
                    <br />
                    <h2 className='text-center text-xl font-extrabold text-gray-900'>OR</h2>
                    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                        <Button
                            title="Sign up again"
                            onClick={() => setSuccess(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default SignupPage